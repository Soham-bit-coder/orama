import { NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { validateComment } from '@/lib/utils/comment-validation';
import { commentService } from '@/lib/services/comments';
import { z } from 'zod';

const mediaTypeSchema = z.enum(['movie', 'tv']);
const commentSchema = z.object({
  mediaId: z.union([z.string(), z.number()]).transform(String),
  mediaType: mediaTypeSchema,
  content: z.string().min(1).max(1000),
  parentId: z.string().nullable().optional(), // Firestore IDs are strings
  season: z.number().int().min(1).max(100).optional(),
  episode: z.number().int().min(1).max(2000).optional(),
});

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const mediaId = searchParams.get('mediaId');
  const mediaType = searchParams.get('mediaType');
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 10;
  const parentId = searchParams.get('parentId') || null;
  const season = parseInt(searchParams.get('season'));
  const episode = parseInt(searchParams.get('episode'));

  if (!mediaId || !mediaType) {
    return NextResponse.json({ error: 'Missing media identifiers' }, { status: 400 });
  }

  try {
    const session = await getSession();
    const userId = session?.userId;

    const { comments, total } = await commentService.getComments(
      mediaId,
      mediaType,
      userId,
      parentId,
      page,
      limit,
      season,
      episode
    );

    return NextResponse.json({
      comments,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validationResult = commentSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({ error: 'Invalid request data', details: validationResult.error }, { status: 400 });
    }

    const { content, mediaId, mediaType, parentId, season, episode } = validationResult.data;

    const contentValidation = validateComment(content);
    if (!contentValidation.isValid) {
      return NextResponse.json({ error: contentValidation.error || 'Invalid comment content' }, { status: 400 });
    }

    const comment = await commentService.createComment({
      userId: session.userId,
      username: session.username,
      mediaId,
      mediaType,
      content,
      parentId,
      season,
      episode
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const commentId = searchParams.get('id');

  if (!commentId) {
    return NextResponse.json({ error: 'Invalid comment ID' }, { status: 400 });
  }

  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await commentService.deleteComment(commentId, session.userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete comment' }, { status: 500 });
  }
}

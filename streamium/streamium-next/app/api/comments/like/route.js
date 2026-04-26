import { NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { commentService } from '@/lib/services/comments';

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { commentId } = await request.json();
    if (!commentId) {
      return NextResponse.json({ error: 'Comment ID is required' }, { status: 400 });
    }

    const result = await commentService.toggleLike(commentId, session.userId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error liking comment:', error);
    return NextResponse.json({ error: 'Failed to like comment' }, { status: 500 });
  }
}

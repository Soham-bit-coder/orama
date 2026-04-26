import { NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { commentService } from '@/lib/services/comments';

export async function POST(request, { params }) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Invalid comment ID' }, { status: 400 });
    }

    const { reason } = await request.json();
    if (!reason) {
      return NextResponse.json({ error: 'Report reason is required' }, { status: 400 });
    }

    await commentService.flagComment(id, reason);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error flagging comment:', error);
    return NextResponse.json({ error: 'Failed to flag comment' }, { status: 500 });
  }
}

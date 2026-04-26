import { NextResponse } from 'next/server';
import { watchlistService } from '@/lib/services/watchlist';
import { getSession } from '@/lib/server/auth';
import { z } from 'zod';

const mediaTypeSchema = z.enum(['movie', 'tv']);

const addToWatchlistSchema = z.object({
  mediaId: z.number().int().positive(),
  mediaType: mediaTypeSchema,
  title: z.string().min(1).max(500),
  posterPath: z.string().max(500).nullable().optional(),
  voteAverage: z.number().min(0).max(10).optional().default(0),
});

const removeFromWatchlistSchema = z.object({
  mediaId: z.number().int().positive(),
  mediaType: mediaTypeSchema,
});

export async function GET(request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const checkId = searchParams.get('checkId');
    const checkType = searchParams.get('checkType');

    if (checkId && checkType) {
      const isInWatchlist = await watchlistService.isInWatchlist(
        session.userId,
        parseInt(checkId),
        checkType
      );
      return NextResponse.json({ isInWatchlist });
    }

    const items = await watchlistService.getWatchlist(session.userId);
    const total = await watchlistService.getWatchlistCount(session.userId);
    return NextResponse.json({ items, total });
  } catch (error) {
    console.error('Watchlist GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = addToWatchlistSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid request data', details: validation.error.flatten() }, { status: 400 });
    }

    const { mediaId, mediaType, title, posterPath, voteAverage } = validation.data;

    const watchlistItem = await watchlistService.addToWatchlist(
      session.userId,
      mediaId,
      mediaType,
      title,
      posterPath || null,
      voteAverage
    );

    return NextResponse.json(watchlistItem);
  } catch (error) {
    console.error('Watchlist POST error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = removeFromWatchlistSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid request data', details: validation.error.flatten() }, { status: 400 });
    }

    const { mediaId, mediaType } = validation.data;

    await watchlistService.removeFromWatchlist(
      session.userId,
      mediaId,
      mediaType
    );

    return NextResponse.json({ message: 'Item removed from watchlist' });
  } catch (error) {
    console.error('Watchlist DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';

const ALLOWED_SIZES = new Set([
  'w45', 'w92', 'w154', 'w185', 'w300', 'w342', 'w500', 'w780',
  'w1280', 'h632', 'original'
]);

const PATH_PATTERN = /^[a-zA-Z0-9_\-./]+$/;

export async function GET(request, { params }) {
  const resolvedParams = await params;
  const TMDB_IMAGE_URL = process.env.TMDB_IMAGE_URL || 'https://image.tmdb.org/t/p';
  const pathParts = resolvedParams.path;

  if (!pathParts || pathParts.length < 2) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
  }

  const size = pathParts[0];
  const actualPath = '/' + pathParts.slice(1).join('/');

  if (!ALLOWED_SIZES.has(size)) {
    return NextResponse.json({ error: 'Invalid size' }, { status: 400 });
  }

  if (actualPath.includes('..') || !PATH_PATTERN.test(actualPath)) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
  }

  try {
    const imageUrl = `${TMDB_IMAGE_URL}/${size}${actualPath}`;
    const response = await fetch(imageUrl);

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch image' }, { status: response.status });
    }

    const contentType = response.headers.get('Content-Type') || 'image/jpeg';
    const body = response.body;

    return new Response(body, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err) {
    console.error('Image proxy error:', err);
    return NextResponse.json({ error: 'Failed to load image' }, { status: 500 });
  }
}

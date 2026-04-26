import { NextResponse } from 'next/server';

// Python vidsrc-api running locally
const VIDSRC_API = process.env.VIDSRC_API_URL || 'http://localhost:8000';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const type = searchParams.get('type') || 'movie';
  const season = searchParams.get('season');
  const episode = searchParams.get('episode');

  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  try {
    // Use /streams/ endpoint which tries both vidsrc.me sources
    let apiUrl = `${VIDSRC_API}/streams/${id}`;
    if (type === 'tv' && season && episode) {
      apiUrl += `?s=${season}&e=${episode}`;
    }

    const res = await fetch(apiUrl, { signal: AbortSignal.timeout(35000) });
    if (!res.ok) throw new Error(`vidsrc-api responded with ${res.status}`);

    const data = await res.json();
    const sources = data.sources || [];

    // Find first source with a valid stream
    const valid = sources.find(s => s?.data?.stream);
    if (!valid) {
      return NextResponse.json({ error: 'No streams found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      url: valid.data.stream,
      subtitles: valid.data.subtitle || [],
      provider: valid.name,
    });

  } catch (error) {
    console.error('Resolve error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

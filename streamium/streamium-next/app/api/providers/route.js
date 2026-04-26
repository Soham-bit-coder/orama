import { NextResponse } from 'next/server';

function validateProviderUrl(url) {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') {
      return null;
    }
    return url;
  } catch {
    return null;
  }
}

export async function GET() {
  return NextResponse.json({
    vidsrc_net: validateProviderUrl(process.env.VIDSRC_NET_URL),
    vidlink: validateProviderUrl(process.env.VIDLINK_BASE_URL),
  });
}

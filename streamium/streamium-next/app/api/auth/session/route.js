import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ error: 'Auth disabled' }, { status: 503 });
}

export async function DELETE() {
  return NextResponse.json({ success: true });
}

export async function GET() {
  return NextResponse.json({ user: null });
}

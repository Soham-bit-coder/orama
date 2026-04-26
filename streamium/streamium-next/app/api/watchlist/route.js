import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ items: [], total: 0 });
}

export async function POST() {
  return NextResponse.json({ error: 'Auth disabled' }, { status: 503 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Auth disabled' }, { status: 503 });
}

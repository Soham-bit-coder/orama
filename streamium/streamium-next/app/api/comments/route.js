import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ comments: [], total: 0, page: 1, totalPages: 0 });
}

export async function POST() {
  return NextResponse.json({ error: 'Auth disabled' }, { status: 503 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Auth disabled' }, { status: 503 });
}

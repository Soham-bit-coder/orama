import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/server/firebase-admin';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const { idToken } = await request.json();
    
    // Set session expiration to 5 days
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    
    const cookieStore = await cookies();
    cookieStore.set('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Session creation failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  return NextResponse.json({ success: true });
}

export async function GET() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  
  if (!sessionCookie) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
  
  try {
    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    return NextResponse.json({
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name || 'User',
      }
    });
  } catch (error) {
    console.error('Session validation failed:', error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}

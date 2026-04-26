import { adminAuth } from './firebase-admin';
import { cookies } from 'next/headers';

export async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  if (!sessionCookie || !adminAuth) {
    // If no session cookie or firebase admin is not initialized
    return null;
  }

  try {
    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    return {
      userId: decodedToken.uid,
      email: decodedToken.email,
      username: decodedToken.name || 'User',
    };
  } catch (error) {
    console.error('Session verification failed:', error);
    return null;
  }
}

/**
 * Verify a Firebase ID Token from the Authorization header
 * Authorization: Bearer <ID_TOKEN>
 */
export async function getAuthUser(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    return {
      userId: decodedToken.uid,
      email: decodedToken.email,
    };
  } catch (error) {
    console.error('ID Token verification failed:', error);
    return null;
  }
}

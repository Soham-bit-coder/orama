import admin from 'firebase-admin';

let isInitialized = false;

if (!admin.apps.length) {
  try {
    if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
      isInitialized = true;
    } else {
      console.warn('Firebase Admin SDK: Missing FIREBASE_PRIVATE_KEY or FIREBASE_CLIENT_EMAIL. Skipping initialization.');
    }
  } catch (error) {
    console.error('Firebase admin initialization error:', error.message);
  }
} else {
  isInitialized = true;
}

export const adminAuth = isInitialized ? admin.auth() : null;
export const adminDb = isInitialized ? admin.firestore() : null;

import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const initializeFirebaseAdmin = () => {
    if (!process.env.FIREBASE_ADMIN_PROJECT_ID ||
        !process.env.FIREBASE_ADMIN_CLIENT_EMAIL ||
        !process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
        throw new Error('Missing Firebase Admin SDK credentials in environment variables');
    }

    if (getApps().length === 0) {
        return initializeApp({
            credential: cert({
                projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
                clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
            }),
        });
    }
    return getApps()[0];
};

export const getAdminAuth = () => {
    const app = initializeFirebaseAdmin();
    return getAuth(app);
};

export const getAdminDb = () => {
    const app = initializeFirebaseAdmin();
    return getFirestore(app);
};
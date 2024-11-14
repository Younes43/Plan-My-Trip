import { getAdminDb } from '@/config/firebase-admin';
import { UserActivity, ActivityTrackerResponse, TravelPlanRequest, TripPlan } from '@/types';
import { Timestamp } from 'firebase-admin/firestore';

const COLLECTION_NAME = 'userActivities';

export async function trackPlanGeneration(
    userId: string,
    parameters: TravelPlanRequest,
    result: { success: boolean; plan?: TripPlan; error?: string },
    metadata: {
        userAgent?: string;
        ipAddress?: string;
        duration?: number;
        userDetails?: {
            email: string | null;
            isAnonymous: boolean;
            authProvider: string;
            createdAt: string | null;
        } | null;
    }
): Promise<ActivityTrackerResponse> {
    try {
        const db = getAdminDb();
        const activityRef = db.collection(COLLECTION_NAME);

        const activity = {
            // User identification
            userId,
            userEmail: metadata?.userDetails?.email || null,
            isAnonymous: metadata?.userDetails?.isAnonymous || false,
            authProvider: metadata?.userDetails?.authProvider || 'anonymous',
            createdAt: metadata?.userDetails?.createdAt
                ? Timestamp.fromMillis(Date.parse(metadata.userDetails.createdAt))
                : null,

            // Request metadata
            timestamp: Timestamp.fromDate(new Date()),
            ipAddress: metadata?.ipAddress || null,
            userAgent: metadata?.userAgent || null,
            duration: metadata?.duration || null,

            // Activity details
            activityType: 'PLAN_GENERATION',
            parameters,
            result: {
                success: result.success,
                planId: result.success ? crypto.randomUUID() : null,
                plan: result.plan || null,
                error: result.error || null
            }
        };

        const docRef = await activityRef.add(activity);

        return {
            success: true,
            activityId: docRef.id
        };
    } catch (error) {
        console.error('Error tracking activity:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error tracking activity'
        };
    }
}

export async function getUserActivities(userId: string, limit = 10): Promise<UserActivity[]> {
    try {
        const db = getAdminDb();
        const activitiesRef = db.collection(COLLECTION_NAME);
        const q = activitiesRef
            .where('userId', '==', userId)
            .orderBy('timestamp', 'desc')
            .limit(limit);

        const querySnapshot = await q.get();

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp.toDate()
        })) as UserActivity[];
    } catch (error) {
        console.error('Error fetching user activities:', error);
        throw error;
    }
}

export async function getActivityById(userId: string, activityId: string) {
    try {
        const db = getAdminDb();
        const activitiesRef = db.collection(COLLECTION_NAME);
        const q = activitiesRef
            .where('userId', '==', userId)
            .where('__name__', '==', activityId);

        const querySnapshot = await q.get();

        if (querySnapshot.empty) {
            return null;
        }

        return {
            id: querySnapshot.docs[0].id,
            ...querySnapshot.docs[0].data()
        };
    } catch (error) {
        console.error('Error fetching activity:', error);
        throw error;
    }
}

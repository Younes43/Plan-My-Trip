import { NextResponse } from 'next/server';
import { generateTravelPlan } from '@/utils/ai-service';
import { TravelPlanRequest } from '@/types';
import { headers } from 'next/headers';
import { getAdminAuth } from '@/config/firebase-admin';
import { trackPlanGeneration } from '@/utils/activity-tracker';

const logApiRequest = (logData: Record<string, unknown>) => {
  console.log(JSON.stringify(logData));
};

export const runtime = 'nodejs';

export async function POST(request: Request): Promise<Response> {
  const startTime = Date.now();
  const headersList = headers();
  const authHeader = headersList.get('authorization');
  const ip = headersList.get('x-forwarded-for') || 'unknown';
  const userAgent = headersList.get('user-agent') || 'unknown';
  let userId: string | undefined;
  let requestBody: TravelPlanRequest | undefined;
  let userDetails = null;
  
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.split('Bearer ')[1];
  
  try {
    requestBody = await request.json() as TravelPlanRequest;

    // Try to get user details, but don't fail if we can't
    try {
      const adminAuth = getAdminAuth();
      const decodedToken = await adminAuth.verifyIdToken(token);
      const userRecord = await adminAuth.getUser(decodedToken.uid);
      userId = decodedToken.uid;
      
      userDetails = {
        email: userRecord.email || null,
        isAnonymous: userRecord.providerData.length === 0,
        authProvider: userRecord.providerData[0]?.providerId || 'anonymous',
        createdAt: userRecord.metadata.creationTime || null
      };
    } catch (authError) {
      console.warn('Could not get user details:', authError);
      // Extract userId from token without admin SDK
      try {
        const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        userId = decoded.user_id || decoded.sub;
      } catch (e) {
        console.error('Could not decode token:', e);
      }
    }

    if (!userId) {
      return NextResponse.json({ error: 'Invalid authentication' }, { status: 401 });
    }

    const plan = await generateTravelPlan(requestBody);

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Log successful request
    logApiRequest({
      timestamp: new Date().toISOString(),
      endpoint: '/api/generatePlan',
      method: 'POST',
      input: requestBody,
      userId,
      ip,
      userAgent,
      statusCode: 200,
      success: true,
      duration: `${duration}ms`
    });

    // Track successful plan generation
    await trackPlanGeneration(
      userId,
      requestBody,
      { success: true, plan },
      {
        ipAddress: ip,
        userAgent,
        duration,
        userDetails: userDetails || undefined
      }
    );

    return NextResponse.json({ plan });
  } catch (error) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';

    // Log error
    const logData = {
      timestamp: new Date().toISOString(),
      endpoint: '/api/generatePlan',
      method: 'POST',
      userId,
      ip,
      userAgent,
      error: errorMessage,
      statusCode: 500,
      success: false,
      duration: `${duration}ms`,
      requestBody // Include the request body in logs if it was parsed successfully
    };
    logApiRequest(logData);

    // Track failed plan generation in Firestore only if we have both userId and requestBody
    if (userId && requestBody) {
      await trackPlanGeneration(userId, requestBody, { 
        success: false, 
        error: errorMessage 
      }, {
        ipAddress: ip,
        userAgent,
        duration
      });
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: error instanceof Error && error.message.includes('Rate limit') ? 429 : 500 }
    );
  }
}
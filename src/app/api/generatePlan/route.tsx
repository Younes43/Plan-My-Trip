import { NextResponse } from 'next/server';
import { generateTravelPlan } from '@/utils/ai-service';
import { TravelPlanRequest } from '@/types';

const logApiRequest = (logData: Record<string, unknown>) => {
  console.log(JSON.stringify(logData));
};

export async function POST(request: Request): Promise<Response> {
  const startTime = Date.now();
  let requestBody = {};
  
  try {
    requestBody = await request.json();
    const body = requestBody as TravelPlanRequest;
    const plan = await generateTravelPlan(body);

    const endTime = Date.now();
    const duration = endTime - startTime;

    const logData = {
      timestamp: new Date().toISOString(),
      endpoint: '/api/generatePlan',
      method: 'POST',
      input: body,
      statusCode: 200,
      success: true,
      duration: `${duration}ms`
    };

    logApiRequest(logData);
    return NextResponse.json({ plan });

  } catch (error) {
    console.error('Error generating plan:', error);

    const endTime = Date.now();
    const duration = endTime - startTime;

    const logData = {
      timestamp: new Date().toISOString(),
      endpoint: '/api/generatePlan',
      method: 'POST',
      input: requestBody,
      error: error instanceof Error ? error.message : String(error),
      statusCode: 500,
      success: false,
      duration: `${duration}ms`
    };

    logApiRequest(logData);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}
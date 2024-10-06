import { NextResponse } from 'next/server';
import { generateTravelPlan } from '@/utils/openai';
import { TravelPlanRequest } from '@/types';
import fs from 'fs/promises';
import path from 'path';

export const runtime = 'edge';

const logApiRequest = async (logData: Record<string, unknown>) => {
  const logPath = path.join(process.cwd(), 'logs', 'api_requests.log');
  const logEntry = JSON.stringify(logData, null, 2) + '\n\n';
  await fs.appendFile(logPath, logEntry);
};

export async function POST(request: Request): Promise<Response> {
  const startTime = Date.now();
  
  try {
    const body: TravelPlanRequest = await request.json();
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

    await logApiRequest(logData);

    return NextResponse.json({ plan });
  } catch (error) {
    console.error('Error generating plan:', error);

    const endTime = Date.now();
    const duration = endTime - startTime;

    const logData = {
      timestamp: new Date().toISOString(),
      endpoint: '/api/generatePlan',
      method: 'POST',
      input: await request.json().catch(() => ({})),
      error: error instanceof Error ? error.message : String(error),
      statusCode: 500,
      success: false,
      duration: `${duration}ms`
    };

    await logApiRequest(logData);

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkRateLimit } from '@/utils/rateLimiter';
import { dateUtils } from '@/utils/ai-service';

const MAX_TRIP_DAYS = 10;

export async function middleware(request: NextRequest) {
    if (request.method !== 'POST') {
        return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
    }

    try {
        const ip = request.ip || 'unknown';
        await checkRateLimit('TRAVEL_PLAN', ip);

        const body = await request.clone().json();

        if (!body.destination || !body.startDate || !body.endDate || body.budgetMin === undefined || body.budgetMax === undefined) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const durationInDays = dateUtils.getDaysBetweenDates(body.startDate, body.endDate);

        if (durationInDays > MAX_TRIP_DAYS) {
            return NextResponse.json({ error: `Trip duration cannot exceed ${MAX_TRIP_DAYS} days` }, { status: 400 });
        }

        if (durationInDays < 1) {
            return NextResponse.json({ error: 'Trip duration must be at least 1 day' }, { status: 400 });
        }

        if (body.budgetMin < 0 || body.budgetMax < body.budgetMin) {
            return NextResponse.json({ error: 'Invalid budget range' }, { status: 400 });
        }

        return NextResponse.next();
    } catch (error) {
        const statusCode = error instanceof Error && error.message.includes('Rate limit') ? 429 : 500;
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal Server Error' },
            { status: statusCode }
        );
    }
}

export const config = {
    matcher: '/api/generatePlan'
};

import { aiConfig } from '@/config/ai-config';
import { generateWithOpenAI } from './openai';
import { generateTravelPlanWithGemini } from './gemini';
import { TravelPlanRequest, TripPlan } from '@/types';

// Add date utilities here
function formatDateToUTC(dateString: string) {
    // Create date object and force it to midnight UTC
    const date = new Date(dateString);
    // Set the time to noon UTC to avoid any timezone issues
    date.setUTCHours(12, 0, 0, 0);

    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'  // Force UTC timezone
    });
}

function getDaysBetweenDates(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    start.setUTCHours(12, 0, 0, 0);
    end.setUTCHours(12, 0, 0, 0);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

function generateDateRange(startDate: string, endDate: string): string[] {
    const dates: string[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    start.setUTCHours(12, 0, 0, 0);
    end.setUTCHours(12, 0, 0, 0);

    const current = new Date(start);
    while (current <= end) {
        dates.push(current.toISOString().split('T')[0]);
        current.setUTCDate(current.getUTCDate() + 1);
    }
    return dates;
}

export async function generateTravelPlan(request: TravelPlanRequest): Promise<TripPlan> {
    // Format dates before passing to AI providers
    const formattedRequest = {
        ...request,
        formattedStartDate: formatDateToUTC(request.startDate),
        formattedEndDate: formatDateToUTC(request.endDate),
        dateRange: generateDateRange(request.startDate, request.endDate)
    };

    const provider = aiConfig.provider;

    switch (provider) {
        case 'gemini':
            return generateTravelPlanWithGemini(formattedRequest);
        case 'openai':
            return generateWithOpenAI(formattedRequest);
        default:
            throw new Error(`Unsupported AI provider: ${provider}`);
    }
}

// Export utilities if needed elsewhere
export const dateUtils = {
    formatDateToUTC,
    getDaysBetweenDates,
    generateDateRange
};
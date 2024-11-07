import { aiConfig } from '@/config/ai-config';
import { generateWithOpenAI } from './openai';
import { generateTravelPlanWithGemini } from './gemini';
import { TravelPlanRequest, TripPlan } from '@/types';

export async function generateTravelPlan(request: TravelPlanRequest): Promise<TripPlan> {
    const provider = aiConfig.provider;

    switch (provider) {
        case 'gemini':
            return generateTravelPlanWithGemini(request);
        case 'openai':
            return generateWithOpenAI(request);
        default:
            throw new Error(`Unsupported AI provider: ${provider}`);
    }
}
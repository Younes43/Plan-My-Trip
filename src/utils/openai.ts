import OpenAI from 'openai';
import { TravelPlanRequest, TripPlan } from '@/types';
import fs from 'fs/promises';
import path from 'path';
import rateLimit from './rateLimiter';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

const limiter = rateLimit({
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 500, // Max 500 users per second
});

const logOpenAICall = async (logData: Record<string, unknown>) => {
    const logPath = path.join(process.cwd(), 'logs', 'openai_calls.log');
    const logEntry = JSON.stringify(logData, null, 2) + '\n\n';
    await fs.appendFile(logPath, logEntry);
};

const calculateCost = (promptTokens: number, completionTokens: number) => {
    const promptPricePerToken = 0.00000015;
    const completionPricePerToken = 0.0000006;
    return (promptTokens * promptPricePerToken) + (completionTokens * completionPricePerToken);
};

export async function generateTravelPlan(request: TravelPlanRequest): Promise<TripPlan> {
    const { destination, startDate, endDate, budgetMin, budgetMax } = request;

    const startTime = Date.now();
    try {
        // Check rate limit
        await limiter.check(20, 'OPENAI_API_CALL') // 5 requests per minute

        const completion = await openai.chat.completions.create({
            model: MODEL,
            messages: [
                {
                    role: "system",
                    content: `You are a helpful travel planner assistant. Provide a day-by-day itinerary including suggestions for activities and transportation. Suggest a single accommodation for the entire trip. The suggestions should be flexible and not force specific timings on the user. Format your response as a JSON object without any additional formatting or comments. Use the following structure:
            {
              "accommodation": {
                "name": "Accommodation name",
                "type": "Hotel/Hostel/Airbnb"
              },
              "days": [
                {
                  "day": 1,
                  "date": "YYYY-MM-DD",
                  "activities": [
                    {
                      "description": "Activity description",
                      "location": "Location name"
                    }
                  ],
                  "transportation": "Transportation suggestion for the day"
                }
              ]
            }`
                },
                {
                    role: "user",
                    content: `Create a flexible travel plan for a trip to ${destination} from ${startDate} to ${endDate} with a budget range of ${budgetMin} to ${budgetMax}. Include daily activity suggestions and transportation options. Suggest a single accommodation for the entire trip. The plan should be adaptable and not impose strict timings on the traveler.`
                }
            ],
        });

        const endTime = Date.now();
        const duration = endTime - startTime;

        const promptTokens = completion.usage?.prompt_tokens || 0;
        const completionTokens = completion.usage?.completion_tokens || 0;
        const totalCost = calculateCost(promptTokens, completionTokens);

        const logData = {
            timestamp: new Date().toISOString(),
            input: {
                destination,
                startDate,
                endDate,
                budgetMin,
                budgetMax
            },
            output: completion.choices[0].message.content,
            statusCode: 200,
            success: true,
            model: MODEL,
            price: totalCost.toFixed(6),
            duration: `${duration}ms`,
            promptTokens,
            completionTokens,
            totalTokens: completion.usage?.total_tokens || 0
        };

        await logOpenAICall(logData);

        const content = completion.choices[0].message.content;
        if (!content) throw new Error("No content in completion");

        // Remove any potential markdown or code block formatting
        const cleanedContent = content.replace(/```json\n?|\n?```/g, '').trim();

        // Attempt to parse the cleaned content
        const parsedContent = JSON.parse(cleanedContent);

        return parsedContent as TripPlan;
    } catch (error) {
        if (error instanceof Error && error.message === 'Rate limit exceeded') {
            console.error('Rate limit exceeded for OpenAI API calls');
            throw new Error('Too many requests. Please try again later.');
        }
        console.error('Error generating plan:', error);
        throw error;
    }
}
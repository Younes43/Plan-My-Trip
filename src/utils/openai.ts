import OpenAI from 'openai';
import { TravelPlanRequest, TripPlan } from '@/types';
import rateLimit from './rateLimiter';
import { getPlacePhoto } from './googlePlaces';



const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

const limiter = rateLimit({
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 500, // Max 500 users per second
});

const logOpenAICall = (logData: Record<string, unknown>) => {
    console.log('OpenAI API Call:', JSON.stringify(logData, null, 2));
};

const calculateCost = (promptTokens: number, completionTokens: number) => {
    const promptPricePerToken = 0.00000015;
    const completionPricePerToken = 0.0000006;
    return (promptTokens * promptPricePerToken) + (completionTokens * completionPricePerToken);
};

// Define the getDefaultImage function
const getDefaultImage = (index: number) => {
    const defaultImages = [
        "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80",
        "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80",
        "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
        "https://images.unsplash.com/photo-1555992336-fb0d29498b13?w=800&q=80",
        "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&q=80",
    ];
    return defaultImages[index % defaultImages.length];
};

export async function generateTravelPlan(request: TravelPlanRequest): Promise<TripPlan> {
    const { destination, startDate, endDate, budgetMin, budgetMax } = request;

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
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

        // Fetch images for each day's location
        for (const day of parsedContent.days) {
            const locationImage = await getPlacePhoto(day.activities[0].location);
            day.image = locationImage || getDefaultImage(day.day - 1); // Fallback to default image if no Google image is found
        }

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
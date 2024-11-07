import { GoogleGenerativeAI } from "@google/generative-ai";
import { Accommodation, DayPlan, TravelPlanRequest, TripPlan } from '@/types';
import { getPlacePhoto } from "./googlePlaces";
import { aiConfig } from "@/config/ai-config";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const DEBUG = true; // Toggle debugging

// Add this interface to type the debug data
interface DebugData {
  prompt?: string;
  response?: unknown;
  error?: string;
  duration?: string;
  totalDuration?: string;
  numberOfDays?: number;
  numberOfChunks?: number;
  destination?: string;
  startDate?: string;
  endDate?: string;
  budgetMin?: number;
  budgetMax?: number;
  [key: string]: unknown;  // Allow for additional properties
}

function logDebug(message: string, data?: DebugData) {
  if (DEBUG) {
    console.log('\n=================');
    console.log(message);
    if (data) console.log(JSON.stringify(data, null, 2));
    console.log('=================\n');
  }
}

const requestCache = new Map<string, Promise<TripPlan>>();

export async function generateTravelPlanWithGemini(request: TravelPlanRequest): Promise<TripPlan> {
  // Create a unique key for this request
  const requestKey = JSON.stringify({
    destination: request.destination,
    startDate: request.startDate,
    endDate: request.endDate,
    budgetMin: request.budgetMin,
    budgetMax: request.budgetMax,
  });

  // Check if this exact request is already in progress
  if (requestCache.has(requestKey)) {
    logDebug('Returning cached request');
    return requestCache.get(requestKey)!;
  }

  const promise = generatePlan(request);
  requestCache.set(requestKey, promise);

  // Clean up cache after request completes
  promise.finally(() => {
    requestCache.delete(requestKey);
  });

  return promise;
}

// Move the existing function logic here
async function generatePlan(request: TravelPlanRequest): Promise<TripPlan> {
  const totalStartTime = Date.now();
  // Convert request to DebugData type
  const debugData: DebugData = {
    destination: request.destination,
    startDate: request.startDate,
    endDate: request.endDate,
    budgetMin: request.budgetMin,
    budgetMax: request.budgetMax
  };
  logDebug('Starting travel plan generation', debugData);

  const { destination, startDate, endDate, budgetMin, budgetMax } = request;
  const model = genAI.getGenerativeModel({ model: aiConfig.models.gemini });

  // First request: Get accommodations
  const accommodationsPrompt = `Suggest exactly 4 DIFFERENT and UNIQUE hotels/places to stay in ${destination} with a budget range of ${budgetMin} to ${budgetMax}, each with distinct characteristics:
1. A high-end luxury option
2. A mid-range option with excellent reviews
3. A budget-friendly option with good value
4. A unique or boutique option

Each accommodation must have a different name and different price point.

Return ONLY a valid JSON object with NO additional text, following this EXACT structure:
{
  "accommodations": [
    {
      "name": "string",
      "type": "Luxury | Mid-range | Budget-friendly | Unique/Boutique",
      "rating": number,
      "pricePerNight": number,
      "description": "string",
      "amenities": ["string"],
      "bookingUrl": "string"
    }
  ]
}`;

  // Second request: Get itinerary in chunks of 3 days
  const numberOfDays = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24));
  const chunkSize = 3;
  const chunks = Math.ceil(numberOfDays / chunkSize);
  const currentDate = new Date(startDate);

  async function getItineraryChunk(startDay: number, numDays: number, chunkStartDate: Date) {
    const chunkStartTime = Date.now();
    const chunkPrompt = `Create a ${numDays}-day itinerary for days ${startDay}-${startDay + numDays - 1} of a trip to ${destination}.
Each day MUST include EXACTLY:
- 2 attractions/activities (with descriptions, locations, and durations)
- 2 restaurants (MUST BE UNIQUE across all days in this chunk):
  * One for lunch/brunch (timeOfDay should be "afternoon")
  * One for dinner (timeOfDay should be "evening")
- Transportation suggestions

IMPORTANT: Ensure all restaurants and attractions are UNIQUE within this ${numDays}-day chunk. Do not repeat any place names.

Return ONLY a valid JSON object with NO additional text, following this EXACT structure:
{
  "days": [
    {
      "day": number,
      "date": "YYYY-MM-DD",
      "places": [
        {
          "name": "string",
          "type": "attraction | restaurant",
          "description": "string",
          "location": "string",
          "timeOfDay": "morning | afternoon | evening",
          "duration": "string",
          "cuisine": "string (only for restaurants)",
          "priceRange": "string (only for restaurants)"
        }
      ],
      "transportation": "string"
    }
  ]
}`;

    logDebug(`Generating chunk for days ${startDay}-${startDay + numDays - 1}`, {
      prompt: chunkPrompt
    });

    const result = await model.generateContent(chunkPrompt);
    const response = await result.response;
    const text = response.text();
    const chunk = JSON.parse(cleanResponseText(text));

    const chunkDuration = Date.now() - chunkStartTime;
    logDebug(`Chunk ${startDay}-${startDay + numDays - 1} completed`, {
      duration: `${chunkDuration}ms`,
      response: chunk
    });

    // Update dates for this chunk
    chunk.days.forEach((day: DayPlan) => {
      day.date = new Date(chunkStartDate.getTime() + ((day.day - startDay) * 24 * 60 * 60 * 1000))
        .toISOString().split('T')[0];
    });

    return chunk;
  }

  try {
    logDebug('Generating accommodations with prompt:', {
      prompt: accommodationsPrompt
    });

    const [accommodationsJson, ...dayChunks] = await Promise.all([
      // Get accommodations
      model.generateContent(accommodationsPrompt)
        .then(async (result) => {
          const response = await result.response;
          const json = JSON.parse(cleanResponseText(response.text()));
          logDebug('Accommodations response:', json);
          validateAccommodations(json.accommodations);
          return json;
        }),
      // Generate all day chunks in parallel
      ...Array.from({ length: chunks }, async (_, i) => {
        const startDay = i * chunkSize + 1;
        const remainingDays = numberOfDays - i * chunkSize;
        const daysInChunk = Math.min(chunkSize, remainingDays);
        const chunkDate = new Date(currentDate.getTime() + (i * chunkSize * 24 * 60 * 60 * 1000));
        return getItineraryChunk(startDay, daysInChunk, chunkDate);
      })
    ]);

    const fullPlan = {
      accommodations: accommodationsJson.accommodations,
      days: dayChunks.flatMap(chunk => chunk.days)
        .sort((a, b) => a.day - b.day)
    };

    logDebug('Starting image processing');
    await processImagesInParallel(fullPlan, destination);

    // Add this line to validate and organize the plan
    validateAndOrganizePlan(fullPlan);

    const totalDuration = Date.now() - totalStartTime;
    logDebug('Travel plan generation completed', {
      totalDuration: `${totalDuration}ms`,
      numberOfDays,
      numberOfChunks: chunks
    });

    return fullPlan;
  } catch (error) {
    logDebug('Error generating plan:', {
      error: error instanceof Error
        ? error.message
        : typeof error === 'string'
          ? error
          : 'Unknown error'  // Fallback for other error types
    });
    throw error;
  }
}

function validateAccommodations(accommodations: Accommodation[]) {
  if (!accommodations || accommodations.length !== 4) {
    throw new Error('Must have exactly 4 accommodations');
  }

  const requiredTypes: Accommodation['type'][] = ['Luxury', 'Mid-range', 'Budget-friendly', 'Unique/Boutique'];
  const types = accommodations.map(a => a.type);
  if (!requiredTypes.every(type => types.includes(type))) {
    throw new Error('Accommodations must include all required types');
  }

  // Check for unique names
  const names = new Set(accommodations.map(a => a.name));
  if (names.size !== 4) {
    throw new Error('All accommodations must have unique names');
  }

  // Validate price range
  const prices = accommodations.map(a => a.pricePerNight);
  if (new Set(prices).size !== 4) {
    throw new Error('All accommodations must have different price points');
  }

  // Ensure prices align with types
  const luxuryOption = accommodations.find(a => a.type === 'Luxury');
  const budgetOption = accommodations.find(a => a.type === 'Budget-friendly');
  if (luxuryOption && budgetOption && luxuryOption.pricePerNight <= budgetOption.pricePerNight) {
    throw new Error('Luxury option must be more expensive than budget option');
  }

  return true;
}

function cleanResponseText(text: string): string {
  return text
    .replace(/```json\n?|\n?```/g, '')
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .trim();
}

async function processImagesInParallel(plan: TripPlan, destination: string) {
  const imagePromises = [
    // Process accommodation images
    ...plan.accommodations.map(async (accommodation) => {
      const image = await getPlacePhoto({
        name: accommodation.name,
        city: destination,
        type: 'accommodation'
      });
      accommodation.image = image || undefined; // Convert null to undefined
    }),

    // Process place images
    ...plan.days.flatMap(day => [
      ...day.places.map(async (place) => {
        const image = await getPlacePhoto({
          name: place.name,
          location: place.location,
          city: destination,
          type: place.type as 'attraction' | 'restaurant'
        });
        place.image = image || undefined; // Convert null to undefined
      })
    ])
  ];

  await Promise.all(imagePromises);
}

function validateAndOrganizePlan(plan: TripPlan) {
  validateAccommodations(plan.accommodations);

  for (const day of plan.days) {
    const attractions = day.places.filter(p => p.type === 'attraction');
    const restaurants = day.places.filter(p => p.type === 'restaurant');

    if (attractions.length < 2) {
      throw new Error(`Day ${day.day} must have exactly 2 attractions`);
    }

    if (restaurants.length < 2) {
      throw new Error(`Day ${day.day} must have exactly 2 restaurants`);
    }

    // Ensure proper meal timing
    const lunchOptions = restaurants.filter(r =>
      r.timeOfDay === 'afternoon' || r.timeOfDay === 'morning'
    );
    const dinnerOptions = restaurants.filter(r =>
      r.timeOfDay === 'evening'
    );

    if (lunchOptions.length === 0) {
      const firstRestaurant = restaurants[0];
      firstRestaurant.timeOfDay = 'afternoon';
    }

    if (dinnerOptions.length === 0) {
      const lastRestaurant = restaurants[restaurants.length - 1];
      lastRestaurant.timeOfDay = 'evening';
    }

    // Sort places by time of day
    day.places.sort((a, b) => {
      const timeOrder = { 'morning': 0, 'afternoon': 1, 'evening': 2 };
      return timeOrder[a.timeOfDay] - timeOrder[b.timeOfDay];
    });
  }
}
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Accommodation, DayPlan, TravelPlanRequest, TripPlan } from '@/types';
import { getPlacePhoto, getAccommodationPhoto, getDefaultImage } from "./googlePlaces";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function generateTravelPlanWithGemini(request: TravelPlanRequest): Promise<TripPlan> {
  const { destination, startDate, endDate, budgetMin, budgetMax } = request;
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

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

  // Second request: Get itinerary in chunks of 2 days
  const numberOfDays = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24));
  const chunks = Math.ceil(numberOfDays / 2);
  const currentDate = new Date(startDate);

  async function getItineraryChunk(startDay: number, numDays: number, chunkStartDate: Date) {
    const chunkPrompt = `Create a ${numDays}-day itinerary for days ${startDay}-${startDay + numDays - 1} of a trip to ${destination}.
Each day MUST include EXACTLY:
- 2 attractions/activities (with descriptions, locations, and durations)
- 2 restaurants:
  * One for lunch/brunch (timeOfDay should be "afternoon")
  * One for dinner (timeOfDay should be "evening")
- Transportation suggestions

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

    const result = await model.generateContent(chunkPrompt);
    const response = await result.response;
    const text = response.text();
    const chunk = JSON.parse(cleanResponseText(text));

    // Update dates for this chunk
    chunk.days.forEach((day: DayPlan) => {
      day.date = new Date(chunkStartDate.getTime() + ((day.day - startDay) * 24 * 60 * 60 * 1000))
        .toISOString().split('T')[0];
    });

    return chunk;
  }

  try {
    // Get accommodations
    const accommodationsResult = await model.generateContent(accommodationsPrompt);
    const accommodationsResponse = await accommodationsResult.response;
    const accommodationsJson = JSON.parse(cleanResponseText(accommodationsResponse.text()));

    // Validate accommodations have different price points and types
    validateAccommodations(accommodationsJson.accommodations);

    // Get itinerary chunks
    const days = [];
    for (let i = 0; i < chunks; i++) {
      const startDay = i * 2 + 1;
      const remainingDays = numberOfDays - i * 2;
      const daysInChunk = Math.min(2, remainingDays);
      const chunk = await getItineraryChunk(startDay, daysInChunk, currentDate);
      days.push(...chunk.days);
      currentDate.setDate(currentDate.getDate() + daysInChunk);
    }

    // Combine results
    const fullPlan = {
      accommodations: accommodationsJson.accommodations,
      days: days
    };

    // Validate and process images
    await validateAndProcessPlan(fullPlan);

    return fullPlan;
  } catch (error) {
    console.error('Error generating plan:', error);
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

async function validateAndProcessPlan(plan: TripPlan) {
  validateAccommodations(plan.accommodations);

  for (const day of plan.days) {
    // Validate each day has required number of places
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
      // Fix the timing if needed
      const firstRestaurant = restaurants[0];
      firstRestaurant.timeOfDay = 'afternoon';
    }

    if (dinnerOptions.length === 0) {
      // Fix the timing if needed
      const lastRestaurant = restaurants[restaurants.length - 1];
      lastRestaurant.timeOfDay = 'evening';
    }

    // Sort places by time of day
    day.places.sort((a, b) => {
      const timeOrder = { 'morning': 0, 'afternoon': 1, 'evening': 2 };
      return timeOrder[a.timeOfDay] - timeOrder[b.timeOfDay];
    });

    // Add images
    const mainAttraction = attractions[0];
    if (mainAttraction) {
      day.image = await getPlacePhoto(mainAttraction.location) || getDefaultImage(day.day - 1);
    }

    for (const place of day.places) {
      place.image = await getPlacePhoto(place.location) || getDefaultImage(0);
    }
  }

  // Add images for accommodations
  for (const accommodation of plan.accommodations) {
    accommodation.image = await getAccommodationPhoto(accommodation.name) || getDefaultImage(0);
  }

  return plan;
}
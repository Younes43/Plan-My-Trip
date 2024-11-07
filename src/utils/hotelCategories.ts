import { Accommodation } from '@/types';

export const categorizeHotels = (hotels: Accommodation[]) => {
    if (!hotels || hotels.length < 4) {
        throw new Error('Need at least 4 accommodation options');
    }

    // Remove any duplicates based on hotel name
    const uniqueHotels = Array.from(new Map(hotels.map(hotel => [hotel.name, hotel])).values());

    if (uniqueHotels.length < 4) {
        throw new Error('Need 4 unique accommodation options');
    }

    // Calculate value score (rating/price ratio)
    const withValueScore = uniqueHotels.map(hotel => ({
        ...hotel,
        valueScore: hotel.rating / hotel.pricePerNight
    }));

    const categorizedHotels: Accommodation[] = [];
    const usedHotels = new Set();

    // Best Overall (highest combination of rating, popularity, and value)
    const overallScore = [...withValueScore]
        .filter(h => !usedHotels.has(h.name))
        .sort((a, b) =>
            (b.rating * 0.4 + (1 / b.pricePerNight) * 0.6) -
            (a.rating * 0.4 + (1 / a.pricePerNight) * 0.6)
        );
    const bestOverall = overallScore[0];
    usedHotels.add(bestOverall.name);
    categorizedHotels.push({ ...bestOverall, category: 'Best Overall' });

    // Best Reviews (highest rating)
    const bestRating = withValueScore
        .filter(h => !usedHotels.has(h.name))
        .sort((a, b) => b.rating - a.rating)[0];
    usedHotels.add(bestRating.name);
    categorizedHotels.push({ ...bestRating, category: 'Best Reviews' });

    // Best Value (best price/rating ratio)
    const bestValue = withValueScore
        .filter(h => !usedHotels.has(h.name))
        .sort((a, b) => b.valueScore - a.valueScore)[0];
    usedHotels.add(bestValue.name);
    categorizedHotels.push({ ...bestValue, category: 'Best Value' });

    // Most Popular (highest price, assuming luxury = popularity)
    const mostPopular = withValueScore
        .filter(h => !usedHotels.has(h.name))
        .sort((a, b) => b.pricePerNight - a.pricePerNight)[0];
    categorizedHotels.push({ ...mostPopular, category: 'Most Popular' });

    return categorizedHotels;
};

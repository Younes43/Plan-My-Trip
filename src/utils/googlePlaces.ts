import { Client, PlaceInputType } from "@googlemaps/google-maps-services-js";

const client = new Client({});

export const getDefaultImage = (index: number) => {
    const defaultImages = [
        "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80",
        "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80",
        "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
        "https://images.unsplash.com/photo-1555992336-fb0d29498b13?w=800&q=80",
        "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&q=80",
    ];
    return defaultImages[index % defaultImages.length];
};

export async function getPlacePhoto(location: string): Promise<string | null> {
    try {
        const response = await client.findPlaceFromText({
            params: {
                input: location,
                inputtype: "textquery" as PlaceInputType,
                fields: ["photos"],
                key: process.env.GOOGLE_PLACES_API_KEY as string,
            },
        });

        if (response.data.candidates && response.data.candidates[0]?.photos) {
            const photoReference = response.data.candidates[0].photos[0].photo_reference;
            return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoReference}&key=${process.env.GOOGLE_PLACES_API_KEY}`;
        }
        return null;
    } catch (error) {
        console.error("Error fetching place photo:", error);
        return null;
    }
}

export async function getAccommodationPhoto(name: string): Promise<string | null> {
    try {
        const response = await client.findPlaceFromText({
            params: {
                input: name,
                inputtype: "textquery" as PlaceInputType,
                fields: ["photos", "rating"],
                key: process.env.GOOGLE_PLACES_API_KEY as string,
            },
        });

        if (response.data.candidates && response.data.candidates[0]?.photos) {
            const photoReference = response.data.candidates[0].photos[0].photo_reference;
            return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoReference}&key=${process.env.GOOGLE_PLACES_API_KEY}`;
        }
        return null;
    } catch (error) {
        console.error("Error fetching accommodation photo:", error);
        return null;
    }
}



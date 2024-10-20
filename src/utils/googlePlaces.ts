import { Client, PlaceInputType } from "@googlemaps/google-maps-services-js";

const client = new Client({});

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

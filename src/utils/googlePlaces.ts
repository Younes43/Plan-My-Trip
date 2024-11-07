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

type PlaceType = 'attraction' | 'restaurant' | 'accommodation';

export function getGenericPhotoForType(type: PlaceType): string {
    const genericPhotos = {
        restaurant: [
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
            "https://images.unsplash.com/photo-1552566626-52f8b828add9",
            "https://images.unsplash.com/photo-1559339352-11d035aa65de",
            "https://images.unsplash.com/photo-1514933651103-005eec06c04b",
            "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17"
        ],
        attraction: [
            "https://images.unsplash.com/photo-1499856871958-5b9627545d1a",
            "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9",
            "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad",
            "https://images.unsplash.com/photo-1467269204594-9661b134dd2b"
        ],
        accommodation: [
            "https://images.unsplash.com/photo-1566073771259-6a8506099945",
            "https://images.unsplash.com/photo-1582719508461-905c673771fd",
            "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a",
            "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa"
        ]
    };

    const photos = genericPhotos[type];
    return `${photos[Math.floor(Math.random() * photos.length)]}?w=800&q=80`;
}

interface PlaceSearchParams {
    name: string;
    location?: string;
    city: string;
    type: PlaceType;
}

export async function getPlacePhoto(params: PlaceSearchParams): Promise<string | null> {
    try {
        const searchTerms = [
            params.name,
            params.location,
            params.city
        ].filter(Boolean);

        const searchQuery = searchTerms.join(', ');
        console.log(`Searching for photo with params:`, params);

        const response = await client.findPlaceFromText({
            params: {
                input: searchQuery,
                inputtype: "textquery" as PlaceInputType,
                fields: ["photos", "rating", "formatted_address"],
                key: process.env.GOOGLE_PLACES_API_KEY as string,
            },
        });

        if (response.data.candidates && response.data.candidates[0]?.photos) {
            console.log(`Found photo for: ${searchQuery}`);
            const photoReference = response.data.candidates[0].photos[0].photo_reference;
            return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoReference}&key=${process.env.GOOGLE_PLACES_API_KEY}`;
        }

        console.log(`No results found, falling back to generic ${params.type} photo`);
        return getGenericPhotoForType(params.type);
    } catch (error) {
        console.error("Error fetching place photo:", error);
        return getGenericPhotoForType(params.type);
    }
}



export interface Place {
    name: string;
    type: 'attraction' | 'restaurant';
    description: string;
    location: string;
    timeOfDay: 'morning' | 'afternoon' | 'evening';
    duration: string;
    image?: string;
    cuisine?: string;
    priceRange?: string;
}

export interface DayPlan {
    day: number;
    date: string;
    places: Place[];
    transportation: string;
    image?: string;
} 
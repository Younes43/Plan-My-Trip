export interface Accommodation {
    name: string;
    type: 'Luxury' | 'Mid-range' | 'Budget-friendly' | 'Unique/Boutique';
    rating: number;
    pricePerNight: number;
    description: string;
    amenities: string[];
    bookingUrl: string;
    image?: string;
    category?: string;
}

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

export interface TripPlan {
    accommodations: Accommodation[];
    days: DayPlan[];
}

export interface TravelPlanRequest {
    destination: string;
    startDate: string;
    endDate: string;
    budgetMin: number;
    budgetMax: number;
}

export interface UserActivity {
    id?: string;

    // User identification
    userId: string;
    userEmail: string | null;
    isAnonymous: boolean;
    authProvider: string;
    createdAt: Date;

    // Location data
    location: {
        country: string | null;
        city: string | null;
        ip: string | null;
    };

    // Request metadata
    timestamp: Date;
    userAgent: string | null;
    duration: number | null;

    // Activity details
    activityType: 'PLAN_GENERATION';
    parameters: TravelPlanRequest;
    result: {
        success: boolean;
        planId?: string;
        plan?: TripPlan;
        error?: string;
    };
}

export interface ActivityTrackerResponse {
    success: boolean;
    activityId?: string;
    error?: string;
}

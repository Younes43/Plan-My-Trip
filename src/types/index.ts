export interface Accommodation {
    name: string;
    type: string;
}

export interface Activity {
    description: string;
    location: string;
}

export interface DayPlan {
    day: number;
    date: string;
    activities: Activity[];
    transportation: string;
}

export interface TripPlan {
    accommodation: Accommodation;
    days: DayPlan[];
}

export interface TravelPlanRequest {
    destination: string;
    startDate: string;
    endDate: string;
    budgetMin: number;
    budgetMax: number;
}
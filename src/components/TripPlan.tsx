'use client';

import { TripPlan as TripPlanType } from '@/types';
import AccommodationCard from './AccommodationCard';
import DaySection from './DaySection';
import { categorizeHotels } from '@/utils/hotelCategories';

interface TripPlanProps {
  plan: TripPlanType;
}

const TripPlan: React.FC<TripPlanProps> = ({ plan }) => {
  const categorizedHotels = categorizeHotels(plan.accommodations);

  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-2xl font-bold mb-6 pb-2 border-b">Available Accommodations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categorizedHotels.map((accommodation, index) => (
            <AccommodationCard
              key={index}
              accommodation={accommodation}
              category={accommodation.category as 'Best Overall' | 'Best Reviews' | 'Best Value' | 'Most Popular'}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 pb-2 border-b">Day-by-Day Itinerary</h2>
        <div className="space-y-8">
          {plan.days.map((day) => (
            <DaySection key={day.day} day={day} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default TripPlan;
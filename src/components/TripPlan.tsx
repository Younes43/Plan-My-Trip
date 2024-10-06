'use client';

import { motion } from 'framer-motion';
import { MapPin, Bed, Bus, Coffee } from 'lucide-react';
import Image from 'next/image';
import { TripPlan as TripPlanType } from '@/types';

// interface Activity {
//   description: string;
//   location: string;
// }

// interface Accommodation {
//   name: string;
//   type: string;
// }

// interface DayPlan {
//   day: number;
//   date: string;
//   activities: Activity[];
//   transportation: string;
// }

interface TripPlanProps {
  plan: TripPlanType;
}

const images = [
  "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80",
  "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80",
  "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
  "https://images.unsplash.com/photo-1555992336-fb0d29498b13?w=800&q=80",
  "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&q=80",
  "https://images.unsplash.com/photo-1534270804882-6b5048b1c1fc?w=800&q=80",
  "https://images.unsplash.com/photo-1522083165195-3424ed129620?w=800&q=80",
];

const getImageForDay = (index: number) => {
  return images[index % images.length];
};

const TripPlan: React.FC<TripPlanProps> = ({ plan }) => {
  return (
    <div>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
        <div className="p-4 bg-[#4A0E78] text-white">
          <h2 className="text-2xl font-bold">Accommodation</h2>
        </div>
        <div className="p-4 flex items-center space-x-3">
          <Bed className="w-6 h-6 text-[#4A0E78]" />
          <div>
            <p className="font-semibold text-lg">{plan.accommodation.name}</p>
            <p className="text-gray-600">{plan.accommodation.type}</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plan.days.map((day, index) => (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="relative h-48">
              <Image
                src={getImageForDay(index)}
                alt={`Day ${day.day} destination`}
                layout="fill"
                objectFit="cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 text-white">
                <h2 className="text-2xl font-bold">Day {day.day}</h2>
                <p className="text-sm">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div className="space-y-2">
                {day.activities.slice(0, 2).map((activity, actIndex) => (
                  <div key={actIndex} className="flex items-start space-x-2">
                    <Coffee className="w-4 h-4 text-[#4A0E78] mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm text-gray-800">{activity.description}</p>
                      <p className="text-xs text-gray-600 flex items-center">
                        <MapPin className="w-3 h-3 mr-1 text-[#4A0E78]" /> {activity.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <Bus className="w-4 h-4 text-[#4A0E78] flex-shrink-0" />
                <p>{day.transportation}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TripPlan;
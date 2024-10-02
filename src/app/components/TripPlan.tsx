'use client';

import { motion } from 'framer-motion';
import { Clock, MapPin, Home, Car } from 'lucide-react';

interface Activity {
  time: string;
  description: string;
  location: string;
}

interface Accommodation {
  name: string;
  type: string;
}

interface DayPlan {
  day: number;
  date: string;
  activities: Activity[];
  accommodation: Accommodation;
  transportation: string;
}

interface TripPlanProps {
  plan: {
    days: DayPlan[];
  };
}

const TripPlan: React.FC<TripPlanProps> = ({ plan }) => {
  return (
    <div className="space-y-8">
      {plan.days.map((day, index) => (
        <motion.div
          key={day.day}
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-translucent backdrop-blur-md rounded-lg shadow-lg overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-600 to-teal-500 p-4 text-white">
            <h2 className="text-2xl font-bold">Day {day.day}</h2>
            <p className="text-sm">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="p-6 space-y-4 text-white">
            <div className="space-y-2">
              {day.activities.map((activity, actIndex) => (
                <motion.div
                  key={actIndex}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: (index * 0.1) + (actIndex * 0.05) }}
                  className="flex items-start space-x-3"
                >
                  <Clock className="w-5 h-5 text-sky-300 mt-1" />
                  <div>
                    <p className="font-semibold">{activity.time} - {activity.description}</p>
                    <p className="text-sm text-sky-200 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" /> {activity.location}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex items-center space-x-3">
              <Home className="w-5 h-5 text-sky-300" />
              <p><span className="font-semibold">{day.accommodation.name}</span> ({day.accommodation.type})</p>
            </div>
            <div className="flex items-center space-x-3">
              <Car className="w-5 h-5 text-sky-300" />
              <p>{day.transportation}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TripPlan;
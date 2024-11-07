import { Bus, Clock, ExternalLink, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Place, DayPlan } from '@/types';

interface DaySectionProps {
  day: DayPlan;
  
}

const PlaceCard = ({ place }: { place: Place }) => {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.location)}`;
  const isRestaurant = place.type === 'restaurant';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className={`w-full rounded-xl overflow-hidden relative ${
        isRestaurant ? 'bg-amber-50' : 'bg-purple-50'
      }`}
    >
      <div className="flex h-48">
        <div className="w-1/3 relative">
          <Image
            src={place.image || '/default-place.jpg'}
            alt={place.name}
            layout="fill"
            objectFit="cover"
          />
          {isRestaurant && place.cuisine && (
            <div className="absolute top-2 left-2 bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-xs font-medium">
              {place.cuisine}
            </div>
          )}
        </div>
        <div className="w-2/3 p-4 flex flex-col">
          <div className="flex items-start justify-between mb-3">
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              isRestaurant ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800'
            }`}>
              {place.timeOfDay}
            </span>
            {isRestaurant && place.priceRange && (
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full">
                {place.priceRange}
              </span>
            )}
          </div>

          <div className="flex-grow space-y-2 min-h-0">
            <h4 className="font-bold text-gray-900 text-lg line-clamp-1">{place.name}</h4>
            <p className="text-gray-600 text-sm line-clamp-2 mb-2">{place.description}</p>
          </div>

          <div className="mt-auto pt-2 space-y-1.5">
            <a 
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm text-purple-600 hover:text-purple-800 transition-colors group"
            >
              <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="line-clamp-1 flex-grow">{place.location}</span>
              <ExternalLink className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 flex-shrink-0" />
            </a>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="line-clamp-1">{place.duration}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const DaySection: React.FC<DaySectionProps> = ({ day }) => {
  const attractions = day.places.filter((p: Place) => p.type === 'attraction').slice(0, 2);
  const restaurants = day.places.filter((p: Place) => p.type === 'restaurant').slice(0, 2);

  // Validation check
  if (attractions.length < 2 || restaurants.length < 2) {
    console.warn(`Day ${day.day} does not have enough activities or dining options`);
  }

  return (
    <div className="mb-12 pb-8 border-b last:border-b-0">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 rounded-full bg-[#4A0E78] text-white flex items-center justify-center text-xl font-bold">
          {day.day}
        </div>
        <div className="ml-4">
          <h2 className="text-xl font-bold text-gray-900">Day {day.day}</h2>
          <p className="text-sm text-gray-600">
            {new Date(day.date).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Places & Activities</h3>
          <div className="space-y-4">
            {attractions.map((place: Place, i: number) => (
              <PlaceCard key={i} place={place} />
            ))}
          </div>
        </div>
        
        <div className="col-span-1 border-l pl-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Dining</h3>
          <div className="space-y-4">
            {restaurants.map((place: Place, i: number) => (
              <div key={i}>
                <PlaceCard place={place} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-gray-50 rounded-lg p-4 flex items-center text-sm">
        <Bus className="w-4 h-4 text-[#4A0E78] mr-2" />
        <p className="text-gray-700">{day.transportation}</p>
      </div>
    </div>
  );
};

export default DaySection; 
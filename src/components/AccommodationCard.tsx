import { motion } from 'framer-motion';
import { Star, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { Accommodation } from '@/types';

interface AccommodationCardProps {
  accommodation: Accommodation;
  category: 'Best Overall' | 'Best Reviews' | 'Best Value' | 'Most Popular';
}

const AccommodationCard: React.FC<AccommodationCardProps> = ({ 
  accommodation,
  category
}) => {
  const getCategoryColor = (cat: string) => {
    switch(cat) {
      case 'Best Overall': return 'bg-green-100 text-green-800';
      case 'Best Reviews': return 'bg-blue-100 text-blue-800';
      case 'Best Value': return 'bg-orange-100 text-orange-800';
      case 'Most Popular': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleClick = () => {
    if (accommodation.bookingUrl) {
      window.open(accommodation.bookingUrl, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 w-full"
      onClick={handleClick}
    >
      <div className="relative w-full aspect-[4/3]">
        <Image
          src={accommodation.image as string}
          alt={accommodation.name}
          layout="fill"
          objectFit="cover"
          className="object-center"
        />
        <div className={`absolute top-2 left-2 ${getCategoryColor(category)} px-2 py-1 rounded-full text-xs font-semibold`}>
          {category}
        </div>
      </div>
      <div className="p-3">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{accommodation.name}</h3>
          <div className="flex items-center bg-[#4A0E78] text-white px-1.5 py-0.5 rounded text-xs whitespace-nowrap">
            <Star className="w-3 h-3 mr-0.5" />
            {accommodation.rating}
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">{accommodation.type}</p>
        <div className="flex flex-wrap gap-1 mt-1">
          {accommodation.amenities?.slice(0, 2).map((amenity, index) => (
            <span key={index} className="text-xs text-gray-600">
              • {amenity}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center pt-2 mt-2 border-t">
          <div>
            <span className="text-[#4A0E78] font-bold text-base">${accommodation.pricePerNight}</span>
            <span className="text-xs text-gray-500 font-normal">/night</span>
          </div>
          <button className="text-xs text-[#4A0E78] flex items-center hover:underline">
            View Deal <ExternalLink className="w-3 h-3 ml-1" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AccommodationCard;

import Image from 'next/image';
import { Check } from 'lucide-react';

const AboutSection = () => {
  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 bg-[#F3EFFF]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center">
        <div className="w-full md:w-2/5 mb-12 md:mb-0">
          <div className="relative w-full h-[500px] md:h-96">
            <div className="absolute inset-0 flex flex-col items-center md:block">
              <Image
                alt="Colorful coastal town"
                className="w-64 h-48 object-cover rounded-lg shadow-lg z-10 md:absolute md:top-0 md:left-0"
                src="https://images.unsplash.com/photo-1498307833015-e7b400441eb8?w=800&q=80"
                width={256}
                height={192}
              />
              <Image
                alt="Person with camel in desert"
                className="w-64 h-48 object-cover rounded-lg shadow-lg z-20 md:absolute md:top-1/4 md:left-1/4 md:transform md:rotate-6 mt-4 md:mt-0"
                src="https://images.unsplash.com/photo-1452022582947-b521d8779ab6?w=800&q=80"
                width={256}
                height={192}
              />
              <Image
                alt="Traveler looking at mountain landscape"
                className="w-64 h-48 object-cover rounded-lg shadow-lg z-30 md:absolute md:bottom-0 md:right-0 md:transform md:-rotate-6 mt-4 md:mt-0"
                src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80"
                width={256}
                height={192}
              />
            </div>
          </div>
        </div>
        <div className="md:w-3/5 md:pl-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Discover the World with Journify AI</h2>
          <p className="text-gray-600 mb-6">
            At Journify AI, we believe that travel is more than just visiting new places. It&apos;s about creating unforgettable experiences, broadening your horizons, and connecting with diverse cultures around the globe.
          </p>
          <ul className="space-y-2">
            <li className="flex items-center">
              <Check className="w-5 h-5 text-[#4A0E78] mr-2" />
              <span>Expertly curated travel itineraries</span>
            </li>
            <li className="flex items-center">
              <Check className="w-5 h-5 text-[#4A0E78] mr-2" />
              <span>Personalized experiences for every traveler</span>
            </li>
            <li className="flex items-center">
              <Check className="w-5 h-5 text-[#4A0E78] mr-2" />
              <span>24/7 support throughout your journey</span>
            </li>
            <li className="flex items-center">
              <Check className="w-5 h-5 text-[#4A0E78] mr-2" />
              <span>Sustainable and responsible travel options</span>
            </li>
            <li className="flex items-center">
              <Check className="w-5 h-5 text-[#4A0E78] mr-2" />
              <span>Exclusive deals with trusted partners</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
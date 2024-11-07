import Image from 'next/image';
import TravelPlannerForm from './TravelPlannerForm';
import mountainImage from '@/images/mountain_image.jpg';

const HeroSection = () => {
  return (
    <section className="relative h-[calc(100vh-80px)]">
      <Image
        alt="Mountain landscape"
        className="absolute inset-0 w-full h-full object-cover"
        src={mountainImage}
        layout="fill"
        priority
      />
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4 pt-16 md:pt-20">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 text-center -mt-16 sm:-mt-24 md:-mt-32 lg:-mt-44">
          Let AI Plan Your Next Adventure
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-10 md:mb-12 text-center max-w-3xl">
          Discover Amazing Places with Personalized Itineraries
        </p>
        <div className="w-full max-w-6xl mx-auto -mt-4 sm:-mt-6 md:-mt-8">
          <TravelPlannerForm />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

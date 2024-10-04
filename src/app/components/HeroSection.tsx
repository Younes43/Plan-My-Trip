import Image from 'next/image';
import TravelPlannerForm from './TravelPlannerForm';

const HeroSection = () => {
  return (
    <section className="relative h-[calc(100vh-80px)]">
      <Image
        alt="Mountain landscape"
        className="absolute inset-0 w-full h-full object-cover"
        src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80"
        layout="fill"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4 pt-20 ">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-center -mt-44">Let's travel and explore</h1>
        <p className="text-xl md:text-2xl mb-12 text-center">Discover amazing places at exclusive deals</p>
        <div className="w-full max-w-6xl mx-auto -mt-8">
          <TravelPlannerForm />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
import HeroSection from './components/HeroSection';
import TravelPlannerForm from './components/TravelPlannerForm';

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <HeroSection />
      <TravelPlannerForm />
    </div>
  );
}
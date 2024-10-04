'use client';

import Header from './Header';
import HeroSection from './HeroSection';
import DestinationGallery from './DestinationGallery';
import TravelPlannerForm from './TravelPlannerForm';
import AboutSection from './AboutSection';
import Footer from './Footer';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <DestinationGallery />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
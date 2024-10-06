'use client';

import Header from './Header';
import HeroSection from './HeroSection';
import DestinationGallery from './DestinationGallery';
import AboutSection from './AboutSection';
import Footer from './Footer';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-16">
        <HeroSection />
        <section id="destinations">
          <DestinationGallery />
        </section>
        <section id="about">
          <AboutSection />
        </section>
      </main>
      <section id="contact">
        <Footer />
      </section>
    </div>
  );
};

export default LandingPage;
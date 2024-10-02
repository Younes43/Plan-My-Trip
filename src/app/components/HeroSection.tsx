const HeroSection = () => {
    return (
      <section className="text-center py-20 bg-translucent rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4 text-shadow">
          Plan Your Dream Trip with Plan My Trip
        </h1>
        <p className="text-xl text-white mb-8 text-shadow">
          Let our advanced AI create the perfect itinerary for your next adventure
        </p>
        <a
          href="#planner"
          className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-teal-600 transition duration-300 shadow-md"
        >
          Start Planning
        </a>
      </section>
    );
  };
  
  export default HeroSection;
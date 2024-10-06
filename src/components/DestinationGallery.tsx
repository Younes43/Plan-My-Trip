import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const destinations = [
  { name: "South Africa", image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80" },
  { name: "Asia", image: "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800&q=80" },
  { name: "Italy", image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80" },
  { name: "Thailand", image: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&q=80" },
  { name: "Egypt", image: "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800&q=80" },
  { name: "Nice & Rome", image: "https://images.unsplash.com/photo-1499678329028-101435549a4e?w=800&q=80" },
];

const DestinationGallery = () => {
  return (
    <section className="py-16 px-4 md:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4">Top Destinations</h2>
        <p className="text-center text-gray-600 mb-12">
          Explore our handpicked selection of breathtaking destinations around the world
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination, index) => (
            <div key={index} className="relative rounded-lg overflow-hidden shadow-lg group">
              <Image
                alt={destination.name}
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                src={destination.image}
                width={400}
                height={300}
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-6">
                <h3 className="text-white text-2xl font-bold">{destination.name}</h3>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <button className="bg-[#4A0E78] text-white px-6 py-3 rounded-full inline-flex items-center space-x-2 hover:bg-[#3A0B5E] transition-colors duration-300">
            <span>Explore all</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default DestinationGallery;
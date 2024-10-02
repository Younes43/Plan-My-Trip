'use client';

import Image from 'next/image'
import { motion } from 'framer-motion'

const destinations = [
  { 
    name: 'Paris', 
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500&q=80'
  },
  { 
    name: 'Tokyo', 
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500&q=80'
  },
  { 
    name: 'New York', 
    image: 'https://images.unsplash.com/photo-1522083165195-3424ed129620?w=500&q=80'
  },
]

const HeroSection = () => {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 bg-translucent rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold mb-12 text-shadow">
        Plan Your Dream Trip with Plan My Trip
      </h1>
      <div className="flex flex-wrap justify-center gap-8 mb-12">
        {destinations.map((destination, index) => (
          <motion.div
            key={destination.name}
            className="bg-transparent rounded-lg overflow-hidden shadow-lg w-full sm:w-72 group"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="relative">
              <Image
                src={destination.image}
                alt={destination.name}
                width={400}
                height={300}
                className="w-full h-60 object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-b from-transparent to-black/50 rounded-b-lg">
                <h3 className="text-xl font-semibold text-white">{destination.name}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <p className="text-xl text-white mb-8 text-shadow">
        Let our advanced AI create the perfect itinerary for your next adventure
      </p>
      <a
        href="#planner"
        className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-teal-600 transition duration-300 shadow-md inline-block"
      >
        Start Planning
      </a>
    </section>
  )
}

export default HeroSection
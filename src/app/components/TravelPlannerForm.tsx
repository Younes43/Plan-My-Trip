'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const TravelPlannerForm = () => {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/plan?destination=${destination}&startDate=${startDate}&endDate=${endDate}&budget=${budget}`);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto my-10 bg-translucent p-8 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300" id="planner">
      <div className="mb-4">
        <label htmlFor="destination" className="block form-label font-bold mb-2">
          Destination
        </label>
        <input
          type="text"
          id="destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full px-3 py-2 form-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out hover:shadow-md"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="startDate" className="block form-label font-bold mb-2">
          Start Date
        </label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full px-3 py-2 form-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out hover:shadow-md"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="endDate" className="block form-label font-bold mb-2">
          End Date
        </label>
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full px-3 py-2 form-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out hover:shadow-md"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="budget" className="block form-label font-bold mb-2">
          Budget Range
        </label>
        <select
          id="budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="w-full px-3 py-2 form-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out hover:shadow-md"
          required
        >
          <option value="">Select a budget range</option>
          <option value="budget">Budget ($)</option>
          <option value="moderate">Moderate ($$)</option>
          <option value="luxury">Luxury ($$$)</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-teal-600 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
      >
        Generate Trip Plan
      </button>
    </form>
  );
};

export default TravelPlannerForm;
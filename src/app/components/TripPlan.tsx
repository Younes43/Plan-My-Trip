interface TripPlanProps {
    plan: {
      destination: string;
      startDate: string;
      endDate: string;
      budget: string;
      hotels: string[];
      activities: string[];
      restaurants: string[];
    };
  }
  
  const TripPlan: React.FC<TripPlanProps> = ({ plan }) => {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Trip to {plan.destination}</h2>
        <p className="mb-2">
          <span className="font-semibold">Dates:</span> {plan.startDate} to {plan.endDate}
        </p>
        <p className="mb-4">
          <span className="font-semibold">Budget:</span> {plan.budget}
        </p>
  
        <h3 className="text-xl font-semibold mb-2">Recommended Hotels</h3>
        <ul className="list-disc pl-5 mb-4">
          {plan.hotels.map((hotel, index) => (
            <li key={index}>{hotel}</li>
          ))}
        </ul>
  
        <h3 className="text-xl font-semibold mb-2">Suggested Activities</h3>
        <ul className="list-disc pl-5 mb-4">
          {plan.activities.map((activity, index) => (
            <li key={index}>{activity}</li>
          ))}
        </ul>
  
        <h3 className="text-xl font-semibold mb-2">Recommended Restaurants</h3>
        <ul className="list-disc pl-5">
          {plan.restaurants.map((restaurant, index) => (
            <li key={index}>{restaurant}</li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default TripPlan;
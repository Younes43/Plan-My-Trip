'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import TripPlan from '@/app/components/TripPlan';

export default function PlanPage() {
  const searchParams = useSearchParams();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const destination = searchParams.get('destination');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const budget = searchParams.get('budget');

    // Simulate API call to generate plan
    const generatePlan = async () => {
      setLoading(true);
      // In a real application, you would make an API call here
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate delay

      setLoading(false);
    };

    generatePlan();
  }, [searchParams]);

  if (loading) {
    return <div className="text-center py-20">Generating your travel plan...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Travel Plan</h1>
      {plan && <TripPlan plan={plan} />}
    </div>
  );
}
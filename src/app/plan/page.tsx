'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import TripPlan from '@/app/components/TripPlan';
import LoadingAnimation from '@/app/components/LoadingAnimation';

export default function PlanPage() {
  const searchParams = useSearchParams();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const destination = searchParams.get('destination');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const budget = searchParams.get('budget');

    const generatePlan = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/generatePlan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ destination, startDate, endDate, budget }),
        });
        if (!response.ok) {
          throw new Error('Failed to generate plan');
        }
        const data = await response.json();
        setPlan(data.plan);
      } catch (error) {
        console.error('Error generating plan:', error);
        // You might want to set an error state here and display it to the user
      } finally {
        setLoading(false);
      }
    };

    generatePlan();
  }, [searchParams]);

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-900 to-teal-800 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-white text-center">Your Travel Plan</h1>
        {plan && <TripPlan plan={plan} />}
      </div>
    </div>
  );
}
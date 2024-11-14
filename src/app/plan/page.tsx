'use client';

import { Suspense, useCallback } from 'react';
import { useSearchParams, ReadonlyURLSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import TripPlan from '@/components/TripPlan';
import LoadingAnimation from '@/components/LoadingAnimation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { TripPlan as TripPlanType } from '@/types';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const useGeneratePlan = (searchParams: ReadonlyURLSearchParams) => {
  const { user } = useAuth();
  const [plan, setPlan] = useState<TripPlanType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const generatePlanWithRetry = useCallback(async (retries = 3) => {
    if (!user) {
      router.push('/');
      return;
    }

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const idToken = await user.getIdToken();
        const response = await fetch('/api/generatePlan', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
          },
          body: JSON.stringify({
            destination: searchParams.get('destination'),
            startDate: searchParams.get('startDate'),
            endDate: searchParams.get('endDate'),
            budgetMin: Number(searchParams.get('budgetMin')),
            budgetMax: Number(searchParams.get('budgetMax'))
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status >= 400 && response.status < 500) {
            setError(data.error || `Error: ${response.status}`);
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
          }
          throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }

        setPlan(data.plan);
        return;
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error);
        
        if (error instanceof Error && 
            (error.message.includes('Trip duration') || 
             error.message.includes('budget') ||
             error.message.includes('Missing required'))) {
          setError(error.message);
          throw error;
        }

        if (attempt === retries) {
          setError(error instanceof Error ? error.message : 'Unable to generate travel plan. Please try again.');
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }, [searchParams, user, router]);

  useEffect(() => {
    if (
      searchParams.get('destination') &&
      searchParams.get('startDate') &&
      searchParams.get('endDate') &&
      searchParams.get('budgetMin') &&
      searchParams.get('budgetMax')
    ) {
      generatePlanWithRetry().finally(() => setLoading(false));
    } else {
      setLoading(false);
      setError('Missing required parameters');
    }
  }, [searchParams, generatePlanWithRetry]);

  return { plan, loading, error };
};

const PlanContent = () => {
  const searchParams = useSearchParams();
  const { plan, loading, error } = useGeneratePlan(searchParams);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="relative h-[200px] sm:h-[250px] md:h-[300px]">
          <Image
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80"
            alt="Destination"
            className="absolute inset-0 w-full h-full object-cover"
            layout="fill"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-2 sm:mb-4 text-center">Trip itinerary</h1>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8 sm:py-12">
          {loading ? (
            <LoadingAnimation />
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          ) : plan ? (
            <>
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">Your Travel Itinerary</h2>
              <TripPlan plan={plan} />
            </>
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default function PlanPage() {
  return (
    <Suspense fallback={<LoadingAnimation />}>
      <PlanContent />
    </Suspense>
  );
}
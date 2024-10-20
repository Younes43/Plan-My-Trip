'use client';
import Lottie from 'lottie-react';
import animationData from '@/animations/Animation_loading_plan.json';

const LoadingAnimation = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-8">
        <div style={{ width: '300px', height: '80px' }}>
          <Lottie
            animationData={animationData}
            loop={true}
            autoplay={true}
          />
        </div>
        <p className="text-center mt-4 text-xl font-semibold">Generating your travel plan...</p>
      </div>
    </div>
  );
};

export default LoadingAnimation;

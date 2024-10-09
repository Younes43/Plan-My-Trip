import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import animationData from '@/animations/Animation.json';

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      onFinish();
    }, 4000); // 3 seconds duration

    return () => clearTimeout(timer);
  }, [onFinish]);

  if (!showSplash) return null;

  return (
    <div className="fixed inset-0 bg-[#ba9afc] flex items-center justify-center z-50">
      <div className="w-64 h-64">
        <Lottie
          animationData={animationData}
          loop={true}
          autoplay={true}
        />
      </div>
    </div>
  );
};

export default SplashScreen;
'use client';

import { useEffect, useRef } from 'react';

const LoadingAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs";
    script.type = "module";
    document.body.appendChild(script);

    script.onload = () => {
      if (containerRef.current && !containerRef.current.hasChildNodes()) {
        const player = document.createElement('dotlottie-player');
        player.setAttribute('src', 'https://lottie.host/702b8dfd-4248-4c88-a2c0-55a72fdedbf1/qx0phjouK7.json');
        player.setAttribute('background', 'transparent');
        player.setAttribute('speed', '1');
        player.setAttribute('loop', '');
        player.setAttribute('autoplay', '');
        player.style.width = '300px';
        player.style.height = '300px';
        containerRef.current.appendChild(player);
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-8">
        <div ref={containerRef}></div>
        <p className="text-center mt-4 text-xl font-semibold">Generating your travel plan...</p>
      </div>
    </div>
  );
};

export default LoadingAnimation;

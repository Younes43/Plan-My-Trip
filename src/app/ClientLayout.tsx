'use client';

import { useState, useEffect } from 'react';
import SplashScreen from '@/components/SplashScreen';

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // This effect is needed to trigger a re-render after initial mount
  }, []);

  return (
    <>
      {showSplash ? (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      ) : (
        <>
          {children}
        </>
      )}
    </>
  );
}
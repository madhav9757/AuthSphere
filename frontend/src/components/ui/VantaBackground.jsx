import React, { useEffect, useRef } from 'react';
import useThemeStore from '@/store/themeStore';

const VantaBackground = ({ children }) => {
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);
  const { theme } = useThemeStore();

  useEffect(() => {
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    // Wait for VANTA to be available
    const initVanta = () => {
      if (window.VANTA && window.THREE && vantaRef.current && !vantaEffect.current) {
        vantaEffect.current = window.VANTA.BIRDS({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          backgroundColor: isDark ? 0x0e0e0e : 0xffffff,
          color1: isDark ? 0x6366f1 : 0x000000,
          color2: isDark ? 0x8b5cf6 : 0x333333,
          quantity: 3,
          birdSize: 1.2,
          wingSpan: 25.00,
          speedLimit: 5.00,
          separation: 50.00,
          alignment: 50.00,
          cohesion: 50.00
        });
      } else if (vantaEffect.current) {
        // Update existing effect
        vantaEffect.current.setOptions({
          backgroundColor: isDark ? 0x0e0e0e : 0xffffff,
          color1: isDark ? 0x6366f1 : 0x000000,
          color2: isDark ? 0x8b5cf6 : 0x333333,
        });
      }
    };

    // Try to initialize immediately
    initVanta();

    // If not available yet, wait a bit
    const timer = setTimeout(initVanta, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [theme]);

  // Handle cleanup on unmount separately
  useEffect(() => {
    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  return (
    <div ref={vantaRef} className="relative min-h-screen w-full transition-colors duration-500">
      {children}
    </div>
  );
};

export default VantaBackground;

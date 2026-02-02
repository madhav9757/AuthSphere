import React, { useEffect, useRef } from 'react';

const VantaBackground = ({ children }) => {
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);

  useEffect(() => {
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
          backgroundColor: 0x0e0e0e,
          color1: 0x6366f1,
          color2: 0x8b5cf6,
          quantity: 3,
          birdSize: 1.2,
          wingSpan: 25.00,
          speedLimit: 5.00,
          separation: 50.00,
          alignment: 50.00,
          cohesion: 50.00
        });
      }
    };

    // Try to initialize immediately
    initVanta();

    // If not available yet, wait a bit
    const timer = setTimeout(initVanta, 100);

    return () => {
      clearTimeout(timer);
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  return (
    <div ref={vantaRef} className="relative min-h-screen w-full">
      {children}
    </div>
  );
};

export default VantaBackground;

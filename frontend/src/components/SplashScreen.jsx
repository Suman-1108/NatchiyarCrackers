import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import squareLogoImg from '../assets/logo/natchiyar_square_logo.png';

const SplashScreen = ({ onComplete, duration = 2400 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Prevent background scrolling while splash is visible
    document.body.style.overflow = 'hidden';

    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, [duration]);

  const handleAnimationComplete = () => {
    if (!isVisible) {
      document.body.style.overflow = '';
      if (onComplete) onComplete();
    }
  };

  return (
    <AnimatePresence onExitComplete={handleAnimationComplete}>
      {isVisible && (
        <motion.div
          key="splash-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } }}
          onClick={() => setIsVisible(false)}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-white cursor-pointer select-none overflow-hidden"
          title="Click anywhere to skip"
        >
          {/* Centered Logo, Brand Title & Buffering Animation */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="relative z-10 flex flex-col items-center justify-center px-4 text-center"
          >
            {/* Square/Circular Emblem Logo */}
            <motion.div
              animate={{
                scale: [0.98, 1.02, 0.98]
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="relative flex items-center justify-center mb-3"
            >
              <img
                src={squareLogoImg}
                alt="SRI NATCHIYAR CRACKERS"
                className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 aspect-square object-contain select-none pointer-events-none drop-shadow-sm"
              />
            </motion.div>

            {/* Brand Title: SRI NATCHIYAR CRACKERS */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-[0.16em] uppercase text-[#0D5C3A] font-sans">
              SRI NATCHIYAR CRACKERS
            </h1>

            {/* Smooth Modern Buffering Animation Spinner */}
            <div className="relative w-10 h-10 flex items-center justify-center mt-6">
              {/* Outer clean track */}
              <div className="absolute inset-0 rounded-full border-2.5 border-gray-100" />
              {/* Active smooth spinning buffering arc */}
              <div
                className="absolute inset-0 rounded-full border-2.5 border-transparent border-t-[#0D5C3A] border-r-[#CA8A04] animate-spin"
                style={{ animationDuration: '0.85s' }}
              />
              {/* Center subtle pulsing point */}
              <div className="w-1.5 h-1.5 rounded-full bg-[#0D5C3A] animate-pulse" />
            </div>

            {/* Pulsing loading text: Loading Celebrations... */}
            <div className="flex items-center gap-1 text-[11px] font-black uppercase tracking-[0.25em] text-[#0D5C3A] mt-3">
              <span>Loading Celebrations</span>
              <span className="inline-flex gap-0.5">
                <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;

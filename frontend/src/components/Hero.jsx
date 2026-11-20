import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Sparkles, Flame, Gift, Star, ChevronDown } from 'lucide-react';

const TOTAL_FRAMES = 180;

const getFrameUrl = (frameIndex) => {
  // Frames are named frame-001.webp to frame-180.webp
  const padded = String(frameIndex).padStart(3, '0');
  return `/assets/diwali-frames/frame-${padded}.webp`;
};

// Aspect-ratio preserving rendering on canvas (handles both widescreen cover and mobile framing)
function drawAdaptiveFrame(ctx, img, canvasW, canvasH) {
  if (!img) return;
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  if (!iw || !ih) return;

  const isPortrait = canvasH > canvasW;

  ctx.clearRect(0, 0, canvasW, canvasH);

  if (isPortrait) {
    // Mobile Portrait: fit entire 16:9 width without cutting off the family on sides
    const scale = canvasW / iw;
    const destW = canvasW;
    const destH = ih * scale;
    const destX = 0;
    const destY = (canvasH - destH) / 2;

    ctx.drawImage(img, 0, 0, iw, ih, destX, destY, destW, destH);
  } else {
    // Desktop / Landscape: full-bleed cover
    const scale = Math.max(canvasW / iw, canvasH / ih);
    const destW = iw * scale;
    const destH = ih * scale;
    const destX = (canvasW - destW) / 2;
    const destY = (canvasH - destH) / 2;

    ctx.drawImage(img, 0, 0, iw, ih, destX, destY, destW, destH);
  }
}

const Hero = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const animationFrameId = useRef(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // 4 Category quick cards positioned cleanly below the cinematic scroll banner
  const quickCategories = [
    {
      badge: 'Family Favorites',
      title: 'Consumer Fireworks',
      subtitle: 'Safe exciting crackers for family & backyard celebrations.',
      link: '/products?category=sparklers',
      buttonText: 'Shop Now',
      icon: Sparkles
    },
    {
      badge: 'Grand Functions',
      title: 'Event Fireworks',
      subtitle: 'Custom aerial multi-shots for weddings & temple festivals.',
      link: '/products?category=aerial-shots',
      buttonText: 'Explore',
      icon: Flame
    },
    {
      badge: 'Direct Savings',
      title: 'Seasonal Specials',
      subtitle: 'Limited-time direct factory discount offers on top festival assortments.',
      link: '/products?category=all',
      buttonText: 'View Specials',
      icon: Star
    },
    {
      badge: 'Custom Combos',
      title: 'Fireworks Packages',
      subtitle: 'Curated Maharaja gift boxes for every family celebration budget.',
      link: '/products?category=gift-boxes',
      buttonText: 'View Packages',
      icon: Gift
    }
  ];

  // Draw current frame to canvas
  const renderFrame = useCallback((frameIdx) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const clampedIdx = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(frameIdx)));
    const img = imagesRef.current[clampedIdx] || imagesRef.current[0];
    if (img && img.complete && img.naturalWidth > 0) {
      drawAdaptiveFrame(ctx, img, canvas.width, canvas.height);
    }
  }, []);

  // Responsive Canvas Resolution (handles both mobile portrait & desktop widescreen)
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    renderFrame(currentFrameRef.current);
  }, [renderFrame]);

  // Frame Preloading
  useEffect(() => {
    imagesRef.current = new Array(TOTAL_FRAMES);

    // 1. Load First Frame immediately for instant render
    const firstImg = new Image();
    firstImg.src = getFrameUrl(1);
    firstImg.onload = () => {
      imagesRef.current[0] = firstImg;
      handleResize();
      setIsLoaded(true);
    };

    // 2. Preload remaining frames in background
    for (let i = 2; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFrameUrl(i);
      img.onload = () => {
        imagesRef.current[i - 1] = img;
      };
      img.onerror = () => {
        imagesRef.current[i - 1] = imagesRef.current[i - 2] || imagesRef.current[0];
      };
    }

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [handleResize]);

  // Smooth Render Loop (Lerp between current and target frame)
  useEffect(() => {
    let isRunning = true;

    const loop = () => {
      if (!isRunning) return;

      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) > 0.05) {
        currentFrameRef.current += diff * 0.18;
        renderFrame(currentFrameRef.current);
      }

      animationFrameId.current = requestAnimationFrame(loop);
    };

    animationFrameId.current = requestAnimationFrame(loop);

    return () => {
      isRunning = false;
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [renderFrame]);

  // Scroll Progress Listener (Mobile touch optimized)
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;

      if (totalScrollable <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.min(1, Math.max(0, currentScroll / totalScrollable));

      setScrollProgress(progress);

      const frameIdx = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.floor(progress * (TOTAL_FRAMES - 1)))
      );
      targetFrameRef.current = frameIdx;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {/* =========================================================================
          1. PURE CINEMATIC SCROLL BANNER (Mobile-Optimized Viewport)
         ========================================================================= */}
      <section
        ref={containerRef}
        className="relative w-full h-[170vh] sm:h-[260vh] bg-[#062D1B]"
      >
        {/* Sticky Viewport:
            - Mobile: accounts for fixed header (top-[68px]), viewport height h-[calc(100dvh-68px)]
            - Desktop: top-0, h-screen
        */}
        <div className="sticky top-[68px] sm:top-0 w-full h-[calc(100dvh-68px)] sm:h-screen overflow-hidden flex flex-col items-center justify-center bg-[#062D1B]">
          {/* Subtle Ambient Glow for mobile portrait */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40 sm:opacity-0"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(250,204,21,0.15) 0%, rgba(6,45,27,0.8) 70%, #062D1B 100%)'
            }}
          />

          {/* HTML5 Canvas Rendering 180 Frames with adaptive framing */}
          <div className="relative w-full h-full flex items-center justify-center">
            <canvas
              ref={canvasRef}
              className="w-full h-full object-contain sm:object-cover select-none pointer-events-none block z-10"
            />

            {/* Fallback frame before canvas initializes */}
            {!isLoaded && (
              <img
                src="/assets/diwali-frames/frame-001.webp"
                alt="Sri Natchiyar Crackers Diwali Cinematic Banner"
                className="absolute inset-0 w-full h-full object-contain sm:object-cover block z-10"
              />
            )}
          </div>

          {/* Golden Horizontal Scroll Progress Bar at the bottom of the sticky screen */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40 z-20 pointer-events-none">
            <div
              className="h-full bg-gradient-to-r from-[#0D5C3A] via-yellow-400 to-amber-300 transition-all duration-150"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. 4 CATEGORY QUICK-CARDS (Placed CLEANLY DOWN BELOW the banner)
         ========================================================================= */}
      <section id="quick-categories-section" className="py-10 sm:py-16 bg-[#FAF8F5] border-b border-emerald-100">
        <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16">
          <div className="text-center mb-8 sm:mb-10">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#CA8A04] block mb-1">
              ஸ்ரீ நாச்சியார் பட்டாசு கடை • சிவகாசி நேரடி விற்பனை
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-black text-[#0D5C3A] tracking-tight">
              Curated Celebration Categories
            </h2>
            <div className="w-16 h-1 bg-yellow-400 rounded-full mx-auto mt-2"></div>
          </div>

          {/* Responsive 2-column mobile, 4-column desktop grid */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-left">
            {quickCategories.map((card, idx) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.08 * idx }}
                  className="group p-5 sm:p-6 rounded-2xl bg-white border border-emerald-100 hover:border-[#0D5C3A]/50 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#CA8A04] bg-yellow-50 border border-yellow-200/80 px-2 py-0.5 rounded-md">
                        {card.badge}
                      </span>
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#0D5C3A] flex items-center justify-center group-hover:bg-[#0D5C3A] group-hover:text-yellow-300 transition-colors">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    <h3 className="text-base sm:text-lg font-extrabold text-gray-900 group-hover:text-[#0D5C3A] transition-colors mb-1.5 font-sans">
                      {card.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed mb-5">
                      {card.subtitle}
                    </p>
                  </div>

                  <Link
                    to={card.link}
                    className="w-fit px-4 py-2 text-xs font-bold rounded-xl bg-yellow-400 hover:bg-yellow-300 text-[#073822] shadow-sm hover:shadow group-hover:scale-105 inline-flex items-center gap-1.5 transition-all"
                  >
                    <span>{card.buttonText}</span>
                    <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
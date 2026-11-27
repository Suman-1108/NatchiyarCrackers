import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Sparkles, Flame, Gift, Star } from 'lucide-react';

const DESKTOP_FRAMES = 180;
const MOBILE_FRAMES = 240;

const getDesktopFrameUrl = (frameIndex) => {
  const padded = String(frameIndex).padStart(3, '0');
  return `/assets/diwali-frames/frame-${padded}.webp`;
};

const getMobileFrameUrl = (frameIndex) => {
  const padded = String(frameIndex).padStart(3, '0');
  return `/assets/mobile-diwali-frames/frame-${padded}.webp`;
};

// Full-bleed aspect-ratio preserving frame rendering (clean cover for both portrait mobile and landscape desktop)
function drawCoverFrame(ctx, img, canvasW, canvasH) {
  if (!img) return;
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  if (!iw || !ih) return;

  ctx.clearRect(0, 0, canvasW, canvasH);

  const scale = Math.max(canvasW / iw, canvasH / ih);
  const destW = iw * scale;
  const destH = ih * scale;
  const destX = (canvasW - destW) / 2;
  const destY = (canvasH - destH) / 2;

  ctx.drawImage(img, 0, 0, iw, ih, destX, destY, destW, destH);
}

const checkIsMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
};

const Hero = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  const desktopImagesRef = useRef([]);
  const mobileImagesRef = useRef([]);

  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const animationFrameId = useRef(null);

  const [isMobile, setIsMobile] = useState(checkIsMobile);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const totalFrames = isMobile ? MOBILE_FRAMES : DESKTOP_FRAMES;

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

    const currentImages = isMobile ? mobileImagesRef.current : desktopImagesRef.current;
    const maxIdx = (isMobile ? MOBILE_FRAMES : DESKTOP_FRAMES) - 1;
    const clampedIdx = Math.max(0, Math.min(maxIdx, Math.round(frameIdx)));

    const img = currentImages[clampedIdx] || currentImages[0];
    if (img && img.complete && img.naturalWidth > 0) {
      drawCoverFrame(ctx, img, canvas.width, canvas.height);
    }
  }, [isMobile]);

  // Handle canvas sizing and responsiveness
  const handleResize = useCallback(() => {
    const mobileNow = checkIsMobile();
    setIsMobile(mobileNow);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    renderFrame(currentFrameRef.current);
  }, [renderFrame]);

  // Frame Preloading (Mobile 240 frames vs Desktop 180 frames)
  useEffect(() => {
    const activeCache = isMobile ? mobileImagesRef.current : desktopImagesRef.current;
    const frameCount = isMobile ? MOBILE_FRAMES : DESKTOP_FRAMES;
    const getUrl = isMobile ? getMobileFrameUrl : getDesktopFrameUrl;

    if (activeCache.length < frameCount) {
      activeCache.length = frameCount;
    }

    // 1. Load First Frame immediately for instant render
    const firstImg = new Image();
    firstImg.src = getUrl(1);
    firstImg.onload = () => {
      activeCache[0] = firstImg;
      handleResize();
      setIsLoaded(true);
    };

    // 2. Preload remaining frames asynchronously in background
    for (let i = 2; i <= frameCount; i++) {
      if (!activeCache[i - 1]) {
        const img = new Image();
        img.src = getUrl(i);
        img.onload = () => {
          activeCache[i - 1] = img;
        };
        img.onerror = () => {
          // Fallback to neighboring frame
          activeCache[i - 1] = activeCache[i - 2] || activeCache[0];
        };
      }
    }

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [isMobile, handleResize]);

  // Smooth Render Loop (Lerp between current and target frame)
  useEffect(() => {
    let isRunning = true;

    const loop = () => {
      if (!isRunning) return;

      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) > 0.02) {
        currentFrameRef.current += diff * 0.12;
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

  // Scroll Progress Listener (Maps viewport scroll directly to cinematic frame scrubber)
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;

      if (totalScrollable <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.min(1, Math.max(0, currentScroll / totalScrollable));

      setScrollProgress(progress);

      const maxIdx = (isMobile ? MOBILE_FRAMES : DESKTOP_FRAMES) - 1;
      const frameIdx = Math.min(maxIdx, Math.max(0, Math.floor(progress * maxIdx)));
      targetFrameRef.current = frameIdx;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile]);

  return (
    <>
      {/* =========================================================================
          1. PURE CINEMATIC SCROLL BANNER (Dedicated Portrait Mobile & Widescreen Desktop)
         ========================================================================= */}
      <section
        ref={containerRef}
        className="relative w-full h-[400vh] sm:h-[500vh] bg-[#062D1B]"
      >
        {/* Sticky Viewport:
            - Mobile: accounts for fixed header (top-[68px]), viewport height h-[calc(100dvh-68px)]
            - Desktop: top-0, h-screen
        */}
        <div className="sticky top-[68px] sm:top-0 w-full h-[calc(100dvh-68px)] sm:h-screen overflow-hidden flex flex-col items-center justify-center bg-[#062D1B]">
          {/* HTML5 Canvas Rendering 240 Mobile Frames (Portrait 9:16) or 180 Desktop Frames (Widescreen 16:9) */}
          <div className="relative w-full h-full flex items-center justify-center">
            <canvas
              ref={canvasRef}
              className="w-full h-full object-cover select-none pointer-events-none block z-10"
            />

            {/* Fallback frame before canvas initializes */}
            {!isLoaded && (
              <img
                src={isMobile ? "/assets/mobile-diwali-frames/frame-001.webp" : "/assets/diwali-frames/frame-001.webp"}
                alt="Sri Natchiyar Crackers Diwali Cinematic Banner"
                className="absolute inset-0 w-full h-full object-cover block z-10"
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
                    className="w-fit px-4 py-2 text-xs font-bold rounded-xl bg-[#0D5C3A] hover:bg-[#073822] text-white shadow-sm hover:shadow group-hover:scale-105 inline-flex items-center gap-1.5 transition-all"
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

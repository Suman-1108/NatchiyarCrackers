import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search, Phone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import logoImg from '../assets/logo/natchiyar_logo.png';

const Navbar = ({ onOpenSearch }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItemsCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Collections', path: '/products' },
    { name: 'Products', path: '/products' },
    { name: 'Gallery', path: '/products' },
    { name: 'Contact', path: '/contact' }
  ];

  // Authentic Sivakasi Firework Category Line-Draw Icons
  const categoryLineItems = [
    {
      name: 'Sparklers',
      slug: 'sparklers',
      icon: (
        <svg className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 3-1.9 4.3a2 2 0 0 1-1.1 1.1L4.7 10.3l3.8 2.8a2 2 0 0 1 .7 1.4l.2 4.7 4.2-2.1a2 2 0 0 1 1.8 0l4.2 2.1.2-4.7a2 2 0 0 1 .7-1.4l3.8-2.8-4.3-1.9a2 2 0 0 1-1.1-1.1L12 3Z"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
        </svg>
      )
    },

    {
      name: 'Flower Pots',
      slug: 'flower-pots',
      icon: (
        <svg className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 21h10l-2-9H9l-2 9z" />
          <path d="M12 12V3" />
          <path d="M9 10 5 6" />
          <path d="M15 10l4-4" />
          <circle cx="12" cy="2" r="0.8" fill="currentColor" />
          <circle cx="4" cy="5" r="0.8" fill="currentColor" />
          <circle cx="20" cy="5" r="0.8" fill="currentColor" />
        </svg>
      )
    },

    {
      name: 'Chakkars & Kurvi',
      slug: 'chorsa-kurvi',
      icon: (
        <svg className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="3" />
          <path d="M12 3a9 9 0 0 1 9 9" strokeDasharray="2 2" />
          <path d="M12 9a3 3 0 0 1 3 3" />
          <path d="M8 8l2 2" />
          <path d="M16 16l-2-2" />
        </svg>
      )
    },

    {
      name: 'Sky Rockets',
      slug: 'bombs-rockets',
      icon: (
        <svg className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
          <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
          <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
        </svg>
      )
    },
    
    {
      name: 'Aerial Shots',
      slug: 'shots-set-outs',
      icon: (
        <svg className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="14" width="14" height="7" rx="1.5" />
          <line x1="9" y1="14" x2="9" y2="10" />
          <line x1="12" y1="14" x2="12" y2="8" />
          <line x1="15" y1="14" x2="15" y2="10" />
          <circle cx="12" cy="4" r="1" fill="currentColor" />
          <line x1="12" y1="2" x2="12" y2="3" />
        </svg>
      )
    },
    {
      name: 'Sound Crackers',
      slug: 'bijli-sound',
      icon: (
        <svg className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v3" />
          <circle cx="12" cy="7" r="2" />
          <circle cx="9" cy="11" r="2" />
          <circle cx="15" cy="11" r="2" />
          <circle cx="12" cy="15" r="2" />
          <circle cx="9" cy="19" r="2" />
          <circle cx="15" cy="19" r="2" />
        </svg>
      )
    },
    {
      name: 'Gift Boxes',
      slug: 'gift-boxes',
      icon: (
        <svg className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="8" width="18" height="13" rx="2" />
          <path d="M12 8v13" />
          <path d="M19 8H5a2 2 0 0 1-2-2V5a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v1a2 2 0 0 1-2 2z" />
          <path d="M7.5 4a2.5 2.5 0 0 1 4.5-1.5L12 4" />
          <path d="M16.5 4a2.5 2.5 0 0 0-4.5-1.5L12 4" />
        </svg>
      )
    },
    {
      name: 'Kids & Fancy',
      slug: 'fancy-kids',
      icon: (
        <svg className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v4" />
          <path d="M12 18v4" />
          <path d="M4.93 4.93l2.83 2.83" />
          <path d="M16.24 16.24l2.83 2.83" />
          <path d="M2 12h4" />
          <path d="M18 12h4" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )
    }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-200">
      {/* 1. Top Running Announcement Ticker Bar (Forest Green & Yellow) */}
      <div className="bg-gradient-to-r from-[#062D1B] via-[#0D5C3A] to-[#062D1B] text-white py-1 sm:py-1.5 overflow-hidden border-b border-[#052013] shadow-xs select-none">
        <div className="animate-ticker flex items-center whitespace-nowrap text-[11px] sm:text-xs font-bold tracking-wide">
          {/* Loop Segment 1 */}
          <div className="flex items-center gap-4 sm:gap-8 shrink-0 pr-4 sm:pr-8">
            <span className="flex items-center gap-1.5 sm:gap-2">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-yellow-400 shadow-[0_0_8px_#FACC15] inline-block"></span>
              <span className="text-yellow-400">•</span>
              <span className="text-white">ஸ்ரீ நாச்சியார் பட்டாசு கடை</span>
              <span className="text-yellow-400">•</span>
              <span className="text-white font-bold">சிவகாசி கம்பெனியின் நேரடி விற்பனை</span>
            </span>

            <span className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-yellow-400">•</span>
              <span className="text-sm sm:text-base leading-none">🚚</span>
              <span className="text-white">Direct Sivakasi Factory Wholesale</span>
              <span className="text-yellow-400">•</span>
              <span className="text-white font-black uppercase tracking-wider bg-black/40 px-1.5 sm:px-2 py-0.5 rounded border border-yellow-400/50">
                Wholesale &amp; Retail Orders
              </span>
            </span>

            <span className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-yellow-400">•</span>
              <span className="text-sm sm:text-base leading-none">💥</span>
              <span className="text-white">100% Legal PESO Green Crackers &amp; Fresh 2026 Stock</span>
            </span>

            <span className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-yellow-400">•</span>
              <Phone className="w-3.5 h-3.5 text-white shrink-0" />
              <span className="text-white">Direct Phone:</span>
              <span className="text-white font-black">99941 00905 / 94427 01264 / 93637 79531</span>
            </span>

            <span className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-yellow-400">•</span>
              <span className="text-sm sm:text-base leading-none">✨</span>
              <span className="text-white">Pan-India Fast Transport Delivery</span>
            </span>
          </div>

          {/* Loop Segment 2 (Duplicate for continuous loop) */}
          <div className="flex items-center gap-4 sm:gap-8 shrink-0 pr-4 sm:pr-8" aria-hidden="true">
            <span className="flex items-center gap-1.5 sm:gap-2">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-yellow-400 shadow-[0_0_8px_#FACC15] inline-block"></span>
              <span className="text-white">ஸ்ரீ நாச்சியார் பட்டாசு கடை</span>
              <span className="text-yellow-400">•</span>
              <span className="text-white font-bold">சிவகாசி கம்பெனியின் நேரடி விற்பனை</span>
            </span>

            <span className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-yellow-400">•</span>
              <span className="text-sm sm:text-base leading-none">🚚</span>
              <span className="text-white">Direct Sivakasi Factory Wholesale</span>
              <span className="text-yellow-400">•</span>
              <span className="text-white font-black uppercase tracking-wider bg-black/40 px-1.5 sm:px-2 py-0.5 rounded border border-yellow-400/50">
                Wholesale &amp; Retail Orders
              </span>
            </span>

            <span className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-yellow-400">•</span>
              <span className="text-sm sm:text-base leading-none">💥</span>
              <span className="text-white">100% Legal PESO Green Crackers &amp; Fresh 2026 Stock</span>
            </span>

            <span className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-yellow-400">•</span>
              <Phone className="w-3.5 h-3.5 text-white shrink-0" />
              <span className="text-white">Direct Phone:</span>
              <span className="text-white font-black">99941 00905 / 94427 01264 / 93637 79531</span>
            </span>

            <span className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-yellow-400">•</span>
              <span className="text-sm sm:text-base leading-none">✨</span>
              <span className="text-white">Pan-India Fast Transport Delivery</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Brand Navbar (Responsive for 320px+ Mobile Screens) */}
      <div
        className={`bg-white transition-all duration-200 ${
          isScrolled
            ? 'py-1.5 sm:py-2.5 border-b border-gray-200 shadow-sm'
            : 'py-2 sm:py-3 border-b border-gray-100 shadow-xs'
        }`}
      >
        <div className="w-full max-w-[1760px] mx-auto px-3 sm:px-6 lg:px-10 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo & Title on Left (Square compact logo) */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3.5 shrink-0 group py-0.5 min-w-0">
            <img
              src="/assets/natchiyar_square_logo.png"
              alt="SRI NATCHIYAR CRACKERS Emblem"
              className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 aspect-square object-contain transition-transform duration-200 group-hover:scale-105 shrink-0"
            />

            <div className="flex flex-col leading-none justify-center min-w-0">
              <span className="font-serif font-black text-base sm:text-2xl lg:text-3xl tracking-tight sm:tracking-wide text-[#0D5C3A] uppercase truncate">
                SRI NATCHIYAR
              </span>
              <span className="text-[7.5px] sm:text-[10px] font-extrabold tracking-[0.12em] sm:tracking-[0.2em] text-[#CA8A04] uppercase mt-0.5 whitespace-nowrap">
                CRACKERS • சிவகாசி நேரடி விற்பனை
              </span>
            </div>
          </Link>

          {/* Navigation Links in Center (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `relative py-1 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-[#0D5C3A] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#EAB308]'
                      : 'text-gray-700 hover:text-[#0D5C3A]'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Icons (Fits seamlessly on Mobile) */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Search Boxed Button */}
            <button
              type="button"
              onClick={onOpenSearch}
              aria-label="Search Fireworks"
              className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-md border border-gray-200 bg-white hover:bg-emerald-50 hover:border-emerald-300 text-gray-700 hover:text-[#0D5C3A] transition-colors"
            >
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700" strokeWidth={1.8} />
            </button>

            {/* Shopping Bag Boxed Button with Forest Green Badge */}
            <Link
              to="/cart"
              aria-label="Shopping Cart"
              className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-md border border-gray-200 bg-white hover:bg-emerald-50 hover:border-emerald-300 text-gray-700 hover:text-[#0D5C3A] transition-colors relative"
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700" strokeWidth={1.8} />
              <span className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 bg-[#0D5C3A] text-white text-[9px] sm:text-[10px] font-bold w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center shadow-xs">
                {totalItemsCount > 0 ? totalItemsCount : '0'}
              </span>
            </Link>

            {/* WhatsApp Button (Hidden on mobile to declutter header, visible on tablet & desktop) */}
            <a
              href="https://wa.me/919994100905?text=Hi%20Sri%20Natchiyar%20Crackers%2C%20I%20would%20like%20to%20order%20crackers"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="h-8 sm:h-10 px-2 sm:px-3.5 sm:py-2 rounded-md bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm hidden sm:flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 drop-shadow-2xs" viewBox="0 0 32 32">
                <path fill="#FFFFFF" d="M16 2.5C8.544 2.5 2.5 8.544 2.5 16c0 2.636.75 5.099 2.053 7.185L2.637 29.363l6.398-1.895A13.435 13.435 0 0 0 16 29.5c7.456 0 13.5-6.044 13.5-13.5S23.456 2.5 16 2.5z"/>
                <path fill="#25D366" d="M22.38 19.34c-.35-.18-2.07-1.02-2.39-1.14-.32-.12-.55-.18-.78.18-.23.35-.9 1.14-1.1 1.37-.2.23-.41.26-.76.09-.35-.18-1.47-.54-2.8-1.73-1.04-.92-1.74-2.06-1.95-2.41-.2-.35-.02-.54.15-.71.16-.16.35-.41.53-.61.18-.2.24-.35.35-.58.12-.24.06-.44-.03-.62-.09-.18-.78-1.89-1.07-2.58-.28-.68-.57-.59-.78-.6-.2-.01-.44-.01-.67-.01-.24 0-.62.09-.95.44-.32.35-1.24 1.21-1.24 2.96s1.27 3.43 1.45 3.67c.18.24 2.49 3.81 6.04 5.34.84.37 1.5.58 2.01.75.85.27 1.62.23 2.23.14.68-.1 2.07-.85 2.36-1.66.29-.82.29-1.52.2-1.67-.09-.14-.32-.23-.67-.4z"/>
              </svg>
              <span className="hidden sm:inline">WhatsApp</span>
            </a>

            {/* Direct Phone Call Button (Header Quick Access) */}
            <a
              href="tel:9994100905"
              aria-label="Call Sri Natchiyar Crackers"
              className="h-8 sm:h-10 px-2 sm:px-3 rounded-md bg-[#0D5C3A] hover:bg-[#073822] text-white font-bold text-xs sm:text-sm hidden md:flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Phone className="w-3.5 h-3.5 text-white shrink-0" />
              <span>99941 00905</span>
            </a>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-8 h-8 sm:w-10 sm:h-10 flex lg:hidden items-center justify-center rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Bottom Category Line-Draw Icons Strip */}
      <div className="bg-[#F8FAF8] border-b border-[#E2EBE2] shadow-2xs py-1 sm:py-1.5 px-2 sm:px-6 select-none overflow-x-auto no-scrollbar scroll-smooth">
        <div className="w-full max-w-[1760px] mx-auto flex items-center justify-start lg:justify-center gap-2 sm:gap-4 md:gap-6">
          {categoryLineItems.map((cat) => (
            <Link
              key={cat.slug}
              to={`/products?category=${cat.slug}`}
              className="group flex items-center gap-1 sm:gap-2 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-transparent hover:border-yellow-400 hover:bg-white text-gray-700 hover:text-[#0D5C3A] transition-all shrink-0"
            >
              <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center bg-white border border-emerald-200 group-hover:border-[#0D5C3A] group-hover:bg-[#DCFCE7] group-hover:scale-105 text-[#0D5C3A] transition-all shadow-2xs shrink-0">
                {cat.icon}
              </div>
              <span className="text-[11px] sm:text-xs font-bold tracking-tight whitespace-nowrap text-gray-700 group-hover:text-[#0D5C3A] transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-gray-200 px-4 py-4 shadow-lg"
          >
            <div className="flex flex-col space-y-2">
              <div className="pb-2 mb-1 border-b border-gray-100 flex flex-col">
                <span className="text-xs font-bold text-[#CA8A04]">சிவகாசி கம்பெனியின் நேரடி விற்பனை</span>
              </div>
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2.5 rounded-md text-sm font-semibold transition-colors ${
                      isActive
                        ? 'text-[#0D5C3A] bg-emerald-50 font-bold'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-[#0D5C3A]'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
                <a
                  href="tel:9994100905"
                  className="py-2.5 px-4 rounded-md bg-[#0D5C3A] text-white font-bold text-center flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-white shrink-0" />
                  <span>Call: 99941 00905 / 94427 01264</span>
                </a>
                <a
                  href="https://wa.me/919994100905?text=Hi%20Sri%20Natchiyar%20Crackers%2C%20I%20would%20like%20to%20order%20crackers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-4 rounded-md bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-center flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 drop-shadow-2xs" viewBox="0 0 32 32">
                <path fill="#FFFFFF" d="M16 2.5C8.544 2.5 2.5 8.544 2.5 16c0 2.636.75 5.099 2.053 7.185L2.637 29.363l6.398-1.895A13.435 13.435 0 0 0 16 29.5c7.456 0 13.5-6.044 13.5-13.5S23.456 2.5 16 2.5z"/>
                <path fill="#25D366" d="M22.38 19.34c-.35-.18-2.07-1.02-2.39-1.14-.32-.12-.55-.18-.78.18-.23.35-.9 1.14-1.1 1.37-.2.23-.41.26-.76.09-.35-.18-1.47-.54-2.8-1.73-1.04-.92-1.74-2.06-1.95-2.41-.2-.35-.02-.54.15-.71.16-.16.35-.41.53-.61.18-.2.24-.35.35-.58.12-.24.06-.44-.03-.62-.09-.18-.78-1.89-1.07-2.58-.28-.68-.57-.59-.78-.6-.2-.01-.44-.01-.67-.01-.24 0-.62.09-.95.44-.32.35-1.24 1.21-1.24 2.96s1.27 3.43 1.45 3.67c.18.24 2.49 3.81 6.04 5.34.84.37 1.5.58 2.01.75.85.27 1.62.23 2.23.14.68-.1 2.07-.85 2.36-1.66.29-.82.29-1.52.2-1.67-.09-.14-.32-.23-.67-.4z"/>
              </svg>
                  <span>Chat on WhatsApp: +91 99941 00905</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );

};

export default Navbar;

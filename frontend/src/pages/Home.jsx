import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import PopularProductsTable from '../components/PopularProductsTable';
import { getFeaturedProducts } from '../data/products';
import apiService from '../services/api';
import toast from 'react-hot-toast';
import { 
  Sparkles, 
  ShieldCheck,
  Truck,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Send,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Flame,
  CheckCircle2,
  PhoneCall,
  Smartphone,
  Layers,
  ShoppingBag,
  Gem,
  Award,
  Smile,
  Store,
  Headphones,
  Download
} from 'lucide-react';

import sparklersImg from '../assets/categories/sparkelers.png';
import flowerPotImg from '../assets/categories/Flower_Pot.png';
import chakkarsImg from '../assets/categories/Ground_Chakkars.png';
import rocketsImg from '../assets/categories/rocket_crackers.png';
import fancyImg from '../assets/categories/Fancy.png';
import bijiliImg from '../assets/categories/bijili.png';
import giftBoxImg from '../assets/categories/gift_box.png';
import comboPackImg from '../assets/categories/ComboPack.png';

const Home = () => {
  const featuredProducts = getFeaturedProducts();

  // Curated collections catalog using authentic Sivakasi category artwork
  const curatedCollections = [
    {
      title: 'Sparklers',
      slug: 'sparklers',
      variety: '19 Varieties',
      badge: 'TRADITIONAL LIGHTS',
      description: 'Handheld shimmering gold, silver, and multicolor sparklers from 7 CM to 55 CM (S.No 1-19).',
      image: sparklersImg
    },
    {
      title: 'Flower Pots & Tins',
      slug: 'flower-pots',
      variety: '4 Varieties',
      badge: 'FOUNTAIN OF SPARKS',
      description: 'Majestic fountain showers rising with sparkling golden stars including Ashok pots (S.No 45-48).',
      image: flowerPotImg
    },
    {
      title: 'Bombs & Rockets',
      slug: 'bombs-rockets',
      variety: '7 Varieties',
      badge: 'CELESTIAL ASCENTS',
      description: 'Whistling 2-sound, 3-sound, Navarang, and Unic rockets with thunder bursts (S.No 38-44).',
      image: rocketsImg
    },
    {
      title: 'Shots & Set Outs',
      slug: 'shots-set-outs',
      variety: '13 Varieties',
      badge: 'AERIAL SKY CAKES',
      description: 'From 12 Shot to 240 Shot mega celestial displays and grand 2 inch set outs (S.No 73-85).',
      image: fancyImg
    },
    {
      title: 'Bijli & Sound',
      slug: 'bijli-sound',
      variety: '8 Varieties',
      badge: 'FESTIVE SOUNDS',
      description: 'Crisp rhythmic sound crackers, Bijli 100P/50P, King Bullet, Titanic, and Jurassic (S.No 30-37).',
      image: bijiliImg
    },
    {
      title: 'Single Sound & Walas',
      slug: 'single-sound',
      variety: '11 Varieties',
      badge: 'ROYAL GARLAND LADIS',
      description: '1000 to 10000 Wala festive celebration garlands and thunder single sound shots (S.No 62-72).',
      image: chakkarsImg
    },
    {
      title: 'Fancy & Kids',
      slug: 'fancy-kids',
      variety: '14 Varieties',
      badge: 'KIDS NOVELTIES',
      description: 'Peacock, drones, helicopters, sirens, photo flash, and fun whimsical crackers (S.No 91-104).',
      image: comboPackImg
    },
    {
      title: 'Gift Boxes',
      slug: 'gift-boxes',
      variety: '5 Curations',
      badge: 'HERITAGE ASSORTMENTS',
      description: '20 to 65 item luxury Diwali celebration hampers packaged in regal gift boxes (S.No 113-117).',
      image: giftBoxImg
    }
  ];

  // Enquiry form state
  const [formData, setFormData] = useState({
    name: '',
    emailOrPhone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Please enter your name.');
      return;
    }

    if (!formData.emailOrPhone.trim()) {
      toast.error('Please provide your email address or phone number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const isEmail = formData.emailOrPhone.includes('@');
      const res = await apiService.submitEnquiry({
        name: formData.name,
        email: isEmail ? formData.emailOrPhone : '',
        phone: !isEmail ? formData.emailOrPhone : '',
        contactInfo: formData.emailOrPhone,
        message: formData.message || 'Direct enquiry from homepage get-in-touch form',
        enquiryType: 'Get in Touch Desk'
      });

      if (res.success) {
        toast.success(res.message || 'Thank you! Your message has been sent successfully.');
        setFormData({
          name: '',
          emailOrPhone: '',
          message: ''
        });
      } else {
        toast.error('Failed to submit enquiry. Please call us directly at 9994100905.');
      }
    } catch {
      toast.error('Network error. Please call our sales desk at 9994100905.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-gray-900">
      {/* Hero Section (Full-Width Cinematic Banner) */}
      <Hero />

      {/* Curated Catalog - Explore Our Collections Section */}
      <section className="py-14 sm:py-20 bg-[#FAF8F5] border-b border-emerald-100">
        <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16">
          {/* Section Header */}
          <div className="text-center mb-10 sm:mb-12">
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.28em] text-[#CA8A04] uppercase block mb-1.5">
              CURATED CATALOG • சிவகாசி நேரடி விற்பனை
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#0D5C3A] tracking-tight">
              Explore Our Collections
            </h2>
            <div className="w-16 h-1 bg-yellow-400 rounded-full mx-auto my-3"></div>
            <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
              Discover time-tested traditional crackers and cutting-edge aerial pyrotechnics directly from our Sivakasi factory.
            </p>
          </div>

          {/* 8-Card Collections Grid (4 columns desktop, 2 columns mobile/tablet) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {curatedCollections.map((item) => (
              <Link
                key={item.title}
                to={`/products?category=${item.slug}`}
                className="group bg-white rounded-xl overflow-hidden border border-emerald-100 hover:border-[#0D5C3A]/50 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Image Banner Area */}
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-900 select-none">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>

                  {/* Top Right Variety Pill */}
                  <span className="absolute top-2.5 right-2.5 bg-yellow-400 text-[#073822] text-[10px] font-extrabold px-2 py-0.5 rounded shadow-xs">
                    {item.variety}
                  </span>

                  {/* Bottom Left Category Tag */}
                  <span className="absolute bottom-2.5 left-2.5 text-white/95 text-[9px] font-black tracking-wider uppercase bg-[#073822]/80 backdrop-blur-xs px-2 py-0.5 rounded border border-emerald-500/30">
                    {item.badge}
                  </span>
                </div>

                {/* Card Info Area */}
                <div className="p-4 sm:p-5 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="text-lg sm:text-xl font-serif font-extrabold text-[#0D5C3A] group-hover:text-[#15803D] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed mt-1.5 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Action Link */}
                  <div className="pt-3 mt-4 border-t border-gray-100 flex items-center justify-between text-[11px] font-extrabold tracking-wider text-[#CA8A04] group-hover:text-[#0D5C3A] transition-colors uppercase">
                    <span>EXPLORE COLLECTION</span>
                    <span className="text-base font-bold transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Discover Our Popular Products - Table Format (Image-Free List View as requested) */}
      <PopularProductsTable />

      {/* Why Choose Sri Natchiyar Crackers & Make Every Celebration Memorable Sections */}
      <section className="pt-0 pb-12 sm:pb-16 bg-[#FAF8F5] border-b border-[#EBE4D8]">
        <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-10">
            <span className="text-[11px] sm:text-xs font-extrabold tracking-[0.25em] text-[#CA8A04] uppercase block mb-1.5">
             நேரடி விற்பனை
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#0D5C3A] tracking-tight">
              Why Choose Sri Natchiyar Crackers
            </h2>
            <div className="w-16 h-1 bg-yellow-400 mx-auto my-3 rounded-full"></div>
            <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto">
              ஸ்ரீ நாச்சியார் பட்டாசு கடை – Sivakasi's premier direct factory outlet for authentic, safe, and brilliant celebration crackers.
            </p>
          </div>

          {/* 4 Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Quality Commitment */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#EAE3D6] shadow-xs flex flex-col justify-start hover:shadow-md hover:border-[#0D5C3A]/50 transition-all">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#0D5C3A] mb-5 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#0D5C3A] mb-2">
                Quality Commitment
              </h3>
              <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed">
                100% genuine Sivakasi fireworks adhering to government safety specifications and highest pyrotechnic purity.
              </p>
            </div>

            {/* Card 2: Customer Satisfaction */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#EAE3D6] shadow-xs flex flex-col justify-start hover:shadow-md hover:border-[#0D5C3A]/50 transition-all">
              <div className="w-10 h-10 rounded-lg bg-yellow-50 border border-yellow-200 flex items-center justify-center text-[#CA8A04] mb-5 shrink-0">
                <Smile className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#0D5C3A] mb-2">
                Customer Satisfaction
              </h3>
              <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed">
                Trusted by over 50,000 households and event planners for reliable ignition, brilliant color, and festive joy.
              </p>
            </div>

            {/* Card 3: Retail & Wholesale */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#EAE3D6] shadow-xs flex flex-col justify-start hover:shadow-md hover:border-[#0D5C3A]/50 transition-all">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#0D5C3A] mb-5 shrink-0">
                <Store className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#0D5C3A] mb-2">
                Retail &amp; Wholesale
              </h3>
              <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed">
                Direct factory wholesale pricing for bulk festival bookings alongside premium family retail packs.
              </p>
            </div>

            {/* Card 4: Customer Support */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#EAE3D6] shadow-xs flex flex-col justify-start hover:shadow-md hover:border-[#0D5C3A]/50 transition-all">
              <div className="w-10 h-10 rounded-lg bg-yellow-50 border border-yellow-200 flex items-center justify-center text-[#CA8A04] mb-5 shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#0D5C3A] mb-2">
                Customer Support
              </h3>
              <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed">
                Direct WhatsApp and hotline support: 99941 00905, 94427 01264, 93637 79531.
              </p>
            </div>
          </div>

          {/* Make Every Celebration Memorable Banner Card */}
          <div className="mt-8 sm:mt-12 bg-white rounded-2xl sm:rounded-3xl border border-[#EAE3D6] shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left Column: Text & CTAs */}
            <div className="lg:col-span-6 p-8 sm:p-12 lg:p-14 flex flex-col justify-center">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#0D5C3A] text-[11px] font-extrabold uppercase tracking-wider mb-5 w-fit">
                <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                DIWALI &amp; FESTIVAL SEASON 2026
              </span>

              <h3 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-black text-[#0D5C3A] leading-[1.18] mb-4">
                Make Every Celebration<br className="hidden sm:inline" /> Memorable
              </h3>

              <div className="w-14 h-1 bg-yellow-400 mb-6 rounded-full"></div>

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-8 max-w-md">
                From intimate home Diwali gatherings to grand temple festivals and wedding receptions, Sri Natchiyar Crackers transforms your milestones into dazzling celestial memories.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/products"
                  className="px-6 sm:px-7 py-3 rounded-lg bg-[#0D5C3A] hover:bg-[#073822] text-white font-bold text-xs sm:text-sm inline-flex items-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <span>Explore Collections</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </Link>

                <Link
                  to="/wholesale"
                  className="px-6 sm:px-7 py-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white border border-emerald-600 font-bold text-xs sm:text-sm inline-flex items-center gap-2 shadow-2xs transition-all"
                >
                  <span>Download Price List</span>
                  <Download className="w-4 h-4 text-white" />
                </Link>
              </div>
            </div>

            {/* Right Column: Festive Celebration Photo with smooth left gradient blend */}
            <div className="lg:col-span-6 relative min-h-[300px] sm:min-h-[380px] lg:min-h-full overflow-hidden bg-gray-100">
              <img
                src="https://images.unsplash.com/photo-1517457041081-f7b73500a210?auto=format&fit=crop&w=1200&q=80"
                alt="Festive celebration gathering under ambient lights"
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
              {/* Desktop fade from white into photo */}
              <div className="absolute inset-y-0 left-0 w-28 sm:w-40 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none hidden lg:block" />
              {/* Mobile fade from white top */}
              <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white to-transparent pointer-events-none lg:hidden" />
            </div>
          </div>
        </div>
      </section>

      {/* Customer Modern Enquiry Section (Forest Green & Vibrant Yellow Brand Palette) */}
      <section id="enquiry-section" className="py-16 sm:py-24 bg-gradient-to-b from-[#FAF8F5] via-[#EBF5EE] to-[#F2F9F4] border-t border-emerald-100 relative overflow-hidden scroll-mt-24">
        {/* Subtle Ambient Yellow & Forest Glow */}
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(250, 204, 21, 0.18) 0%, rgba(13, 92, 58, 0.08) 45%, transparent 70%)',
            filter: 'blur(50px)'
          }}
        />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Floating White Card with Forest Green & Yellow Accents */}
          <div className="bg-white rounded-2xl sm:rounded-[28px] p-8 sm:p-12 lg:p-14 shadow-[0_20px_55px_rgba(13,92,58,0.08)] border border-emerald-200/70 relative">
            {/* Centered Headline */}
            <div className="text-center mb-10 sm:mb-14">
              <span className="text-[11px] sm:text-xs font-bold tracking-[0.25em] text-[#CA8A04] uppercase block mb-1.5">
                நேரடி விற்பனை
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-black text-[#0D5C3A] tracking-tight leading-tight">
                Get in touch with Sri Natchiyar Crackers<br className="hidden sm:inline" />
                {' '}Factory Direct Deals
              </h2>
              <div className="w-16 h-1 bg-yellow-400 rounded-full mx-auto mt-3.5"></div>
            </div>

            {/* 2-Column Content Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-start">
              {/* Left Column: Contact Information & Direct Phones */}
              <div className="md:col-span-5 flex flex-col justify-between h-full space-y-6">
                <div className="space-y-5">
                  <div className="bg-[#FAFDFB] p-4 rounded-xl border border-emerald-100">
                    <p className="text-xs font-bold text-[#CA8A04] tracking-wider uppercase mb-1">
                      Direct Factory Call / WhatsApp:
                    </p>
                    <div className="space-y-1">
                      <a
                        href="tel:+919994100905"
                        className="block text-base sm:text-lg font-black text-[#0D5C3A] hover:text-[#15803D] transition-colors"
                      >
                        +91 99941 00905 <span className="text-xs font-normal text-emerald-700 font-sans">(Primary WhatsApp)</span>
                      </a>
                      <a
                        href="tel:+919442701264"
                        className="block text-sm sm:text-base font-bold text-gray-800 hover:text-[#0D5C3A] transition-colors"
                      >
                        +91 94427 01264
                      </a>
                      <a
                        href="tel:+919363779531"
                        className="block text-sm sm:text-base font-bold text-gray-800 hover:text-[#0D5C3A] transition-colors"
                      >
                        +91 93637 79531
                      </a>
                    </div>
                  </div>

                  <div className="bg-[#FAFDFB] p-4 rounded-xl border border-emerald-100">
                    <p className="text-xs font-bold text-[#CA8A04] tracking-wider uppercase mb-1">
                      Email Address:
                    </p>
                    <a
                      href="mailto:sales@natchiyarcrackers.com"
                      className="text-sm sm:text-base font-bold text-[#0D5C3A] hover:text-[#15803D] transition-colors"
                    >
                      sales@natchiyarcrackers.com
                    </a>
                  </div>

                  <div className="bg-[#FAFDFB] p-4 rounded-xl border border-emerald-100">
                    <p className="text-xs font-bold text-[#CA8A04] tracking-wider uppercase mb-1">
                      Factory Direct Outlet:
                    </p>
                    <p className="text-sm font-semibold text-gray-800 leading-snug">
                      ஸ்ரீ நாச்சியார் பட்டாசு கடை<br />
                      Sri Natchiyar Crackers, Factory Direct Outlet,<br />
                      Sivakasi, Tamil Nadu 626123, India
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Clean Form Inputs */}
              <div className="md:col-span-7">
                <form onSubmit={handleEnquirySubmit} className="space-y-5">
                  {/* Two Column Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-xs sm:text-sm font-bold text-[#0D5C3A] mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        className="w-full bg-[#FAFDFB] hover:bg-[#F0FDF4] focus:bg-white focus:ring-2 focus:ring-[#0D5C3A] rounded-xl px-4 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all border border-emerald-200"
                      />
                    </div>

                    <div>
                      <label htmlFor="emailOrPhone" className="block text-xs sm:text-sm font-bold text-[#0D5C3A] mb-2">
                        Mobile Number *
                      </label>
                      <input
                        type="text"
                        id="emailOrPhone"
                        name="emailOrPhone"
                        required
                        value={formData.emailOrPhone}
                        onChange={handleInputChange}
                        placeholder="e.g. 9994100905"
                        className="w-full bg-[#FAFDFB] hover:bg-[#F0FDF4] focus:bg-white focus:ring-2 focus:ring-[#0D5C3A] rounded-xl px-4 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all border border-emerald-200"
                      />
                    </div>
                  </div>

                  {/* Message Field */}
                  <div>
                    <label htmlFor="message" className="block text-xs sm:text-sm font-bold text-[#0D5C3A] mb-2">
                      Celebration Requirements / Cracker List
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Write your festival order, cracker varieties, or direct Sivakasi quote requirements..."
                      className="w-full bg-[#FAFDFB] hover:bg-[#F0FDF4] focus:bg-white focus:ring-2 focus:ring-[#0D5C3A] rounded-xl p-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all resize-none min-h-[130px] border border-emerald-200"
                    />
                  </div>

                  {/* Full-Width Send Message Button (Forest Green & Yellow) */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#0D5C3A] via-[#15803D] to-[#0D5C3A] hover:from-[#15803D] hover:to-[#073822] text-white font-bold text-sm tracking-widest uppercase shadow-md shadow-[#0D5C3A]/25 border border-emerald-500/40 transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Enquiry • நேரடி விலை அறிய'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

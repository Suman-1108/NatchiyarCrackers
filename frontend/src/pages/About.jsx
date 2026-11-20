import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Flame, Sparkles, Award, Users, CheckCircle, ArrowRight, Heart, PhoneCall } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-[#FAF8F5] min-h-screen text-gray-900 pt-40 sm:pt-48 pb-20">
      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#0D5C3A] text-xs font-bold uppercase tracking-wider mb-4"
        >
          <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
        சிவகாசி கம்பெனியின் நேரடி விற்பனை
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-sans text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-6"
        >
          About <span className="forest-gradient-text">Sri Natchiyar Crackers</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto text-base sm:text-lg text-gray-600 leading-relaxed"
        >
          Rooted directly in Sivakasi, Tamil Nadu, <strong>ஸ்ரீ நாச்சியார் பட்டாசு கடை (Sri Natchiyar Crackers)</strong> brings you direct factory-gate firecrackers of supreme quality, glorious festive colours, and unmatched family safety.
        </motion.p>
      </div>

      {/* Main Brand & Logo Identity Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white border border-emerald-100 rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden border border-emerald-200 shadow-xl bg-[#062D1B]">
              <img
                src="/assets/sri_natchiyar_banner.jpg"
                alt="ஸ்ரீ நாச்சியார் பட்டாசு கடை - சிவகாசி கம்பெனியின் நேரடி விற்பனை"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
          </div>

          <div className="lg:col-span-7">
            <span className="text-xs font-bold uppercase tracking-widest text-[#CA8A04] block mb-2">
            நேரடி விற்பனை
            </span>
            <h2 className="font-sans text-2xl sm:text-3xl font-black text-gray-900 mb-4">
              ஸ்ரீ நாச்சியார் பட்டாசு கடை (Sri Natchiyar Crackers)
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
              With divine blessings of <strong className="text-gray-900">Sri Angalaparameswari</strong>, Sri Natchiyar Crackers delivers Sivakasi's finest pyrotechnics directly to our customers. Our hallmark is direct company pricing with zero intermediate commissions, making top-tier festival sparklers and aerial shells affordable for every home.
            </p>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6">
              Every firework batch is inspected for vivid sparks, safe fuse delay, and eco-conscious low smoke emissions to bring your loved ones together in sparkling joy.
            </p>

            <div className="flex flex-wrap gap-3">
              <div className="px-3.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-bold text-[#0D5C3A]">
                ✨ நேரடி கம்பெனி விலை (Direct Factory Rates)
              </div>
              <div className="px-3.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-bold text-[#0D5C3A]">
                🌿 Green Certified Raw Materials
              </div>
              <div className="px-3.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-bold text-[#0D5C3A]">
                📞 99941 00905 / 94427 01264 / 93637 79531
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The Sivakasi Legacy */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-white border border-emerald-100 shadow-lg hover:border-[#0D5C3A]/50 transition-all">
            <Flame className="w-10 h-10 text-[#0D5C3A] mb-5" />
            <h3 className="font-sans text-xl font-bold text-gray-900 mb-3">Authentic Sivakasi Manufacturing</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Produced directly in the fireworks hub of Sivakasi. Sri Natchiyar Crackers upholds authentic formulas and automated chemical screening for reliable spark quality.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-emerald-100 shadow-lg hover:border-[#0D5C3A]/50 transition-all">
            <ShieldCheck className="w-10 h-10 text-[#CA8A04] mb-5" />
            <h3 className="font-sans text-xl font-bold text-gray-900 mb-3">Green Cracker Formulations</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Produced in compliance with safety standards, our crackers achieve lower emissions, safe fuses, and clean burning for safer celebrations.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-emerald-100 shadow-lg hover:border-[#0D5C3A]/50 transition-all">
            <Award className="w-10 h-10 text-emerald-700 mb-5" />
            <h3 className="font-sans text-xl font-bold text-gray-900 mb-3">சிவகாசி நேரடி விற்பனை (Direct Value)</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Direct factory sales mean you get genuine wholesale rates without middleman margins, whether you are buying a family box or bulk requirements.
            </p>
          </div>
        </div>
      </div>

      {/* Values & Principles */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center">
        <h2 className="font-sans text-3xl sm:text-4xl font-black text-gray-900 mb-4">
          Our Core <span className="forest-gradient-text">Values</span>
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-12 max-w-xl mx-auto">
          Built upon trust, transparency, and family happiness across Tamil Nadu and all of India.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
          <div className="p-6 rounded-2xl bg-white border border-emerald-100 shadow-md flex gap-4">
            <CheckCircle className="w-6 h-6 text-[#CA8A04] shrink-0 mt-1" />
            <div>
              <h4 className="font-sans text-base font-bold text-gray-900 mb-1">Zero-Dud Guarantee</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Moisture-proof packing and premium slow-match fuses ensure reliable ignition and safety every single time.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-emerald-100 shadow-md flex gap-4">
            <CheckCircle className="w-6 h-6 text-[#CA8A04] shrink-0 mt-1" />
            <div>
              <h4 className="font-sans text-base font-bold text-gray-900 mb-1">Direct Factory Pricing</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Enjoy transparent wholesale discounts and direct Sivakasi savings with no hidden markups.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-emerald-100 shadow-md flex gap-4">
            <CheckCircle className="w-6 h-6 text-[#CA8A04] shrink-0 mt-1" />
            <div>
              <h4 className="font-sans text-base font-bold text-gray-900 mb-1">Family &amp; Child Safety First</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Handheld sparklers and flower pots feature insulated wire grips and steady burn rates for relaxed family celebrations.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-emerald-100 shadow-md flex gap-4">
            <CheckCircle className="w-6 h-6 text-[#CA8A04] shrink-0 mt-1" />
            <div>
              <h4 className="font-sans text-base font-bold text-gray-900 mb-1">Prompt Parcel Dispatch</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Safe packaging in reinforced crates with prompt dispatch via reliable logistics across all districts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Box (Forest Green & Yellow) */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-10 rounded-3xl bg-gradient-to-r from-[#062D1B] via-[#0D5C3A] to-[#073822] text-white shadow-2xl border border-yellow-400/30">
          <span className="text-xs font-bold text-yellow-300 uppercase tracking-widest block mb-2">
            ஸ்ரீ நாச்சியார் பட்டாசு கடை • சிவகாசி
          </span>
          <h3 className="font-sans text-2xl sm:text-3xl font-black text-white mb-4">
            Ready To Light Up Your Next Grand Celebration?
          </h3>
          <p className="text-sm text-emerald-100 mb-6 max-w-lg mx-auto">
            Explore our complete Sivakasi catalogue or call us directly at <strong>99941 00905</strong> for quick price estimates.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/products" className="bg-yellow-400 hover:bg-yellow-300 text-[#073822] font-black px-8 py-3.5 rounded-xl text-sm shadow-xl transition-all">
              Explore Our Products
            </Link>
            <a
              href="https://wa.me/919994100905?text=Hi%20Sri%20Natchiyar%20Crackers"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-xl text-sm font-bold bg-white/10 hover:bg-white/20 text-yellow-200 border border-yellow-400/40 transition-colors"
            >
              WhatsApp Us: 99941 00905
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
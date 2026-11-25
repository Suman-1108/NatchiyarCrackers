import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ShieldCheck, Heart, Sparkles, MessageCircle } from 'lucide-react';
import { categories } from '../data/categories';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-white border-t border-gray-200 text-gray-600 pt-16 pb-12 overflow-hidden">
      <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12">
          {/* Brand Info & Mission */}
          <div className="lg:col-span-2 flex flex-col">
            <Link to="/" className="flex items-center gap-3 sm:gap-4 mb-5 group">
              <img
                src="/assets/natchiyar_square_logo.png"
                alt="SRI NATCHIYAR CRACKERS Logo"
                className="w-12 h-12 sm:w-14 sm:h-14 lg:w-15 lg:h-15 aspect-square object-contain transition-transform duration-200 group-hover:scale-105 shrink-0"
              />
              <div>
                <span className="font-sans text-xl sm:text-2xl font-black text-gray-900 block leading-tight">
                  <span className="text-[#0D5C3A]">SRI NATCHIYAR</span> CRACKERS
                </span>
                <p className="text-[11px] sm:text-xs tracking-[0.18em] uppercase text-[#CA8A04] font-extrabold mt-0.5">
                  ஸ்ரீ நாச்சியார் பட்டாசு கடை • சிவகாசி
                </p>
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-gray-600 mb-6 max-w-sm">
              <strong className="text-[#0D5C3A] font-extrabold block mb-1">ஸ்ரீ அங்காளபரமேஸ்வரி துணை</strong>
              Rooted in Sivakasi’s historic pyrotechnic heritage. ஸ்ரீ நாச்சியார் பட்டாசு கடை provides genuine factory-gate direct sales (சிவகாசி கம்பெனியின் நேரடி விற்பனை) with 100% legal PESO green cracker certifications.
            </p>

            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href="https://wa.me/919994100905?text=Hi%20Sri%20Natchiyar%20Crackers%2C%20I%20would%20like%20to%20order%20crackers"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white border border-[#25D366] transition-all text-xs font-black shadow-2xs"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span>WhatsApp Enquiry</span>
              </a>
              <a
                href="tel:9994100905"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0D5C3A] border border-[#09472c] text-white hover:bg-[#073822] transition-all text-xs font-bold shadow-2xs"
              >
                <Phone className="w-4 h-4 text-white shrink-0" />
                <span>99941 00905</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col">
            <h4 className="font-sans text-sm font-black uppercase tracking-wider text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0D5C3A]"></span>
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-[#0D5C3A] transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#0D5C3A] transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-[#0D5C3A] transition-colors">All Fireworks</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-[#0D5C3A] transition-colors">Crackers Price List</Link>
              </li>
              <li>
                <Link to="/wholesale" className="hover:text-[#0D5C3A] transition-colors">Wholesale Enquiry</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#0D5C3A] transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="flex flex-col">
            <h4 className="font-sans text-sm font-black uppercase tracking-wider text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
              Top Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              {categories.slice(1, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/products?category=${cat.slug}`}
                    className="hover:text-[#0D5C3A] transition-colors flex items-center justify-between"
                  >
                    <span>{cat.name}</span>
                    <span className="text-[11px] text-gray-400 font-mono">({cat.count})</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/products?category=gift-boxes"
                  className="text-[#0D5C3A] font-bold hover:underline transition-colors"
                >
                  Gift Boxes &amp; Combos →
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Sivakasi Office */}
          <div className="flex flex-col">
            <h4 className="font-sans text-sm font-black uppercase tracking-wider text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0D5C3A]"></span>
              Sivakasi Office
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#0D5C3A] shrink-0 mt-1" />
                <span>SRI NATCHIYAR CRACKERS, Sivakasi Main Road, Virudhunagar District, Tamil Nadu - 626123</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#0D5C3A] shrink-0 mt-1" />
                <div className="flex flex-col">
                  <a href="tel:9994100905" className="hover:text-[#0D5C3A] font-bold text-gray-900 transition-colors">
                    +91 99941 00905
                  </a>
                  <a href="tel:9442701264" className="hover:text-[#0D5C3A] font-semibold text-gray-700 transition-colors">
                    +91 94427 01264
                  </a>
                  <a href="tel:9363779531" className="hover:text-[#0D5C3A] font-semibold text-gray-700 transition-colors">
                    +91 93637 79531
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#0D5C3A] shrink-0" />
                <a href="mailto:sales@natchiyarcrackers.com" className="hover:text-[#0D5C3A] transition-colors">
                  sales@natchiyarcrackers.com
                </a>
              </li>
              <li className="flex items-center gap-2 pt-2 text-xs text-emerald-700 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>PESO Compliant &amp; Green Certified</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal & Compliance Notice */}
        <div className="border border-gray-200 pt-5 pb-5 text-xs text-gray-600 leading-relaxed bg-[#F8FAF8] rounded-2xl p-5 mb-8 shadow-xs border-emerald-100">
          <p className="font-bold text-[#073822] mb-1">
            ⚖️ Legal Fireworks &amp; Safety Compliance Notice:
          </p>
          <p>
            As per the Hon’ble Supreme Court directives and Petroleum and Explosives Safety Organization (PESO) regulations, we manufacture and supply compliant Green Crackers with low-emission QR codes. Fireworks delivery and transport are arranged strictly through licensed parcel services permitted by applicable state laws. Minimum dispatch order value applies for safety logistics.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>
            © {currentYear} <strong className="text-gray-900 font-sans">SRI NATCHIYAR CRACKERS (ஸ்ரீ நாச்சியார் பட்டாசு கடை)</strong>. All Rights Reserved.
          </p>
          <div className="flex items-center space-x-6">
            <Link to="/privacy-policy" className="hover:text-[#0D5C3A] transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-conditions" className="hover:text-[#0D5C3A] transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link to="/wholesale" className="hover:text-[#0D5C3A] transition-colors">
              B2B Trade Portal
            </Link>
            <Link to="/admin" className="hover:text-[#0D5C3A] text-gray-400 transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


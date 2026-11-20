import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

const WhatsAppButton = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const { totalItemsCount, getWhatsAppOrderMessage } = useCart();
  const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919994100905';
  
  const defaultMessage = encodeURIComponent(
    'Hello SRI NATCHIYAR CRACKERS (ஸ்ரீ நாச்சியார் பட்டாசு கடை)! I would like to inquire about your premium fireworks collection and factory wholesale pricing.'
  );

  const whatsappUrl = totalItemsCount > 0
    ? `https://wa.me/${phoneNumber}?text=${getWhatsAppOrderMessage()}`
    : `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <div className={`fixed ${totalItemsCount > 0 ? 'bottom-24 sm:bottom-22' : 'bottom-6'} right-4 sm:right-6 z-40 flex flex-col items-end transition-all duration-300`}>
      {/* Interactive Tooltip Card */}
      {showTooltip && (
        <div className="mb-3 p-3.5 rounded-2xl bg-[#062D1B] border border-yellow-400/50 shadow-2xl text-xs max-w-xs text-white backdrop-blur-md relative animate-in fade-in slide-in-from-bottom-2">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute top-2 right-2 text-yellow-200/70 hover:text-white"
            aria-label="Close message"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <p className="font-extrabold text-yellow-300 mb-0.5">ஸ்ரீ நாச்சியார் பட்டாசு கடை</p>
          <p className="text-[11px] font-bold text-emerald-200 mb-1">Direct Sivakasi WhatsApp Desk: 99941 00905</p>
          <p className="text-gray-300 leading-relaxed text-[11px]">
            Chat directly with our team for 2026 wholesale catalogues, festive gift bookings, and transport support!
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2.5 inline-block w-full text-center py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 font-black text-[#073822] transition-colors shadow-md"
          >
            Start WhatsApp Chat
          </a>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        aria-label="Chat on WhatsApp with Sri Natchiyar Crackers"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#0D5C3A] hover:bg-[#073822] text-yellow-300 border-2 border-yellow-400 shadow-[0_4px_25px_rgba(13,92,58,0.6)] transition-all duration-300 hover:scale-108 active:scale-95"
      >
        <span className="absolute -inset-1 rounded-full bg-yellow-400/30 animate-ping pointer-events-none"></span>
        <MessageCircle className="w-7 h-7 fill-yellow-300 text-[#073822]" />
        <span className="sr-only">Chat on WhatsApp</span>
      </a>
    </div>
  );
};

export default WhatsAppButton;


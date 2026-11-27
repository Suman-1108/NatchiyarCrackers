import React, { useState } from 'react';
import { X } from 'lucide-react';
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
    <div className={`fixed ${totalItemsCount > 0 ? 'bottom-[130px] sm:bottom-22' : 'bottom-6'} right-4 sm:right-6 z-40 flex flex-col items-end transition-all duration-300`}>
      {/* Interactive Tooltip Card */}
      {showTooltip && (
        <div className="mb-3 p-3.5 rounded-2xl bg-[#062D1B] border border-emerald-500/60 shadow-2xl text-xs max-w-[calc(100vw-32px)] sm:max-w-xs text-white backdrop-blur-md relative animate-in fade-in slide-in-from-bottom-2">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute top-2 right-2 text-white/70 hover:text-white transition-colors"
            aria-label="Close message"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <p className="font-extrabold text-white mb-0.5">ஸ்ரீ நாச்சியார் பட்டாசு கடை</p>
          <p className="text-[11px] font-bold text-emerald-300 mb-1">Direct Sivakasi WhatsApp Desk: 99941 00905</p>
          <p className="text-gray-200 leading-relaxed text-[11px]">
            Chat directly with our team for 2026 wholesale catalogues, festive gift bookings, and transport support!
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2.5 inline-block w-full text-center py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] font-bold text-white transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 32 32">
              <path fill="#FFFFFF" d="M16 2.5C8.544 2.5 2.5 8.544 2.5 16c0 2.636.75 5.099 2.053 7.185L2.637 29.363l6.398-1.895A13.435 13.435 0 0 0 16 29.5c7.456 0 13.5-6.044 13.5-13.5S23.456 2.5 16 2.5z"/>
              <path fill="#25D366" d="M22.38 19.34c-.35-.18-2.07-1.02-2.39-1.14-.32-.12-.55-.18-.78.18-.23.35-.9 1.14-1.1 1.37-.2.23-.41.26-.76.09-.35-.18-1.47-.54-2.8-1.73-1.04-.92-1.74-2.06-1.95-2.41-.2-.35-.02-.54.15-.71.16-.16.35-.41.53-.61.18-.2.24-.35.35-.58.12-.24.06-.44-.03-.62-.09-.18-.78-1.89-1.07-2.58-.28-.68-.57-.59-.78-.6-.2-.01-.44-.01-.67-.01-.24 0-.62.09-.95.44-.32.35-1.24 1.21-1.24 2.96s1.27 3.43 1.45 3.67c.18.24 2.49 3.81 6.04 5.34.84.37 1.5.58 2.01.75.85.27 1.62.23 2.23.14.68-.1 2.07-.85 2.36-1.66.29-.82.29-1.52.2-1.67-.09-.14-.32-.23-.67-.4z"/>
            </svg>
            <span>Start WhatsApp Chat</span>
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
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white border-2 border-white shadow-[0_4px_25px_rgba(37,211,102,0.6)] transition-all duration-300 hover:scale-108 active:scale-95 cursor-pointer"
      >
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none"></span>
        <svg className="w-8 h-8 shrink-0 drop-shadow-sm" viewBox="0 0 32 32">
          {/* Solid white speech bubble */}
          <path fill="#FFFFFF" d="M16 2.5C8.544 2.5 2.5 8.544 2.5 16c0 2.636.75 5.099 2.053 7.185L2.637 29.363l6.398-1.895A13.435 13.435 0 0 0 16 29.5c7.456 0 13.5-6.044 13.5-13.5S23.456 2.5 16 2.5z"/>
          {/* Green phone receiver inside white bubble */}
          <path fill="#25D366" d="M22.38 19.34c-.35-.18-2.07-1.02-2.39-1.14-.32-.12-.55-.18-.78.18-.23.35-.9 1.14-1.1 1.37-.2.23-.41.26-.76.09-.35-.18-1.47-.54-2.8-1.73-1.04-.92-1.74-2.06-1.95-2.41-.2-.35-.02-.54.15-.71.16-.16.35-.41.53-.61.18-.2.24-.35.35-.58.12-.24.06-.44-.03-.62-.09-.18-.78-1.89-1.07-2.58-.28-.68-.57-.59-.78-.6-.2-.01-.44-.01-.67-.01-.24 0-.62.09-.95.44-.32.35-1.24 1.21-1.24 2.96s1.27 3.43 1.45 3.67c.18.24 2.49 3.81 6.04 5.34.84.37 1.5.58 2.01.75.85.27 1.62.23 2.23.14.68-.1 2.07-.85 2.36-1.66.29-.82.29-1.52.2-1.67-.09-.14-.32-.23-.67-.4z"/>
        </svg>
        <span className="sr-only">Chat on WhatsApp</span>
      </a>
    </div>
  );
};

export default WhatsAppButton;

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
    <div className={`fixed ${totalItemsCount > 0 ? 'bottom-24 sm:bottom-22' : 'bottom-6'} right-4 sm:right-6 z-40 flex flex-col items-end transition-all duration-300`}>
      {/* Interactive Tooltip Card */}
      {showTooltip && (
        <div className="mb-3 p-3.5 rounded-2xl bg-[#062D1B] border border-emerald-500/60 shadow-2xl text-xs max-w-xs text-white backdrop-blur-md relative animate-in fade-in slide-in-from-bottom-2">
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
            className="mt-2.5 inline-block w-full text-center py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] font-bold text-white transition-all shadow-md active:scale-95"
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
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white border-2 border-white shadow-[0_4px_25px_rgba(37,211,102,0.6)] transition-all duration-300 hover:scale-108 active:scale-95"
      >
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none"></span>
        <svg className="w-7 h-7 text-white fill-current shrink-0" viewBox="0 0 24 24">
          <path d="M12.031 2C6.495 2 2 6.494 2 12.029c0 1.942.553 3.754 1.513 5.293L2 22l4.832-1.472a10.02 10.02 0 0 0 5.199 1.501h.005c5.533 0 10.029-4.494 10.029-10.029A10.03 0 0 0 12.031 2zm5.879 14.288c-.246.691-1.229 1.326-1.72 1.385-.458.056-1.045.081-3.32-.861-2.678-1.107-4.417-3.83-4.551-4.009-.133-.18-1.085-1.444-1.085-2.754 0-1.31.688-1.954.933-2.221.246-.267.537-.333.716-.333.18 0 .36 0 .518.01.168.01.393-.064.615.469.229.549.78 1.905.849 2.044.068.14.114.305.023.486-.091.18-.137.293-.272.451-.137.158-.288.353-.411.474-.137.135-.28.283-.121.556.16.273.71 1.171 1.523 1.895 1.047.933 1.93 1.223 2.203 1.358.273.136.434.114.595-.069.161-.183.688-.8.871-1.074.183-.273.366-.228.614-.137.248.091 1.57.74 1.838.875.268.136.447.203.513.317.066.114.066.66-.18 1.351z"/>
        </svg>
        <span className="sr-only">Chat on WhatsApp</span>
      </a>
    </div>
  );
};

export default WhatsAppButton;

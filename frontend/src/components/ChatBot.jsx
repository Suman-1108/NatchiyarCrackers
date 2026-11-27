import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  X,
  Send,
  Phone,
  RotateCcw,
  ShoppingBag,
  Truck,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Check,
  Plus
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';

const STORE_PHONE = '9994100905';
const STORE_PHONE_2 = '9442701264';
const STORE_PHONE_3 = '9363779531';
const WHATSAPP_NUMBER = '919994100905';

// Pre-defined quick prompt chips
const QUICK_PROMPTS = [
  { id: 'sparklers', label: '✨ Sparklers (மத்தாப்பு)' },
  { id: 'flower_pots', label: '🌋 Flower Pots (பூந்தொட்டி)' },
  { id: 'chakkars', label: '🌀 Ground Chakkars (சக்கரம்)' },
  { id: 'aerial_shots', label: '🎆 Aerial Sky Shots' },
  { id: 'gift_boxes', label: '🎁 Maharaja Gift Boxes' },
  { id: 'min_order', label: '📦 Min Order & Delivery' },
  { id: 'discount', label: '💰 80% Discount Details' },
  { id: 'cart', label: '🛒 My Cart Status' },
  { id: 'call', label: '📞 Call Sivakasi Hotline' }
];

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'bot',
    text: 'Vanakkam! 🙏 Welcome to Sri Natchiyar Crackers (ஸ்ரீ நாச்சியார் பட்டாசு கடை), Sivakasi!\n\nI am your Personal Fireworks Shopping Assistant. Tell me what you are looking for (e.g. "I need some sparklers", "flower pots", "aerial shots", or "gift box under 1000") and I will find the best factory-direct deals for you!',
    time: 'Just now'
  }
];

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [addedItemIds, setAddedItemIds] = useState({});
  const messagesEndRef = useRef(null);

  const { addToCart, cartItems, totalItemsCount, subtotal, minOrderAmount, getWhatsAppOrderMessage } = useCart();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
    }
  }, [messages, isOpen, isTyping]);

  // Handle Add to Cart from within Chat
  const handleAddProductToCart = (product) => {
    addToCart(product, 1);
    setAddedItemIds(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemIds(prev => ({ ...prev, [product.id]: false }));
    }, 2500);
  };

  // Intelligent Personal Shopping Assistant Search & Reply Generator
  const generateBotReply = (query) => {
    const q = query.toLowerCase().trim();

    // ---------------------------------------------------------
    // 1. SPARKLERS (மத்தாப்பு)
    // ---------------------------------------------------------
    if (
      q.includes('sparkle') ||
      q.includes('sparkler') ||
      q.includes('sparkles') ||
      q.includes('sparklers') ||
      q.includes('மத்தாப்பு') ||
      q.includes('kambi') ||
      q.includes('electric') ||
      q === 'sparklers'
    ) {
      const sparklersList = products.filter(p => p.category === 'sparklers');
      return {
        text: '✨ Here are our top certified Sivakasi Sparklers (மத்தாப்பு)! Handcrafted with safe, long-lasting golden and multi-color glittering sparks at flat 80% factory discount:',
        products: sparklersList.slice(0, 4),
        actionType: 'link',
        actionText: `View all ${sparklersList.length} Sparklers Varieties →`,
        actionUrl: '/products?category=sparklers'
      };
    }

    // ---------------------------------------------------------
    // 2. FLOWER POTS / FOUNTAINS (பூந்தொட்டி / பூசட்டி)
    // ---------------------------------------------------------
    if (
      q.includes('pot') ||
      q.includes('pots') ||
      q.includes('flower pot') ||
      q.includes('flowerpot') ||
      q.includes('flower pots') ||
      q.includes('ashok') ||
      q.includes('ashoka') ||
      q.includes('பூந்தொட்டி') ||
      q.includes('பூசட்டி') ||
      q.includes('fountain') ||
      q === 'flower_pots'
    ) {
      const potsList = products.filter(
        p => p.category === 'flower-pots' || p.name.toLowerCase().includes('flower pot') || p.name.toLowerCase().includes('ashok')
      );
      return {
        text: '🌋 Here are our spectacular Volcanic Flower Pots & Ashok Fountains (பூந்தொட்டி)! Glittering golden, silver, and color-changing showers reaching up to 15-20 feet:',
        products: potsList.slice(0, 4),
        actionType: 'link',
        actionText: 'Explore Flower Pots & Tins Collection →',
        actionUrl: '/products?category=flower-pots'
      };
    }

    // ---------------------------------------------------------
    // 3. GROUND CHAKKARS / WHEELS (தரை சக்கரம்)
    // ---------------------------------------------------------
    if (
      q.includes('chakkar') ||
      q.includes('chakkars') ||
      q.includes('wheel') ||
      q.includes('wheels') ||
      q.includes('chakra') ||
      q.includes('vishnu') ||
      q.includes('சக்கரம்') ||
      q.includes('தரை சக்கரம்') ||
      q.includes('spinner') ||
      q === 'chakkars'
    ) {
      const chakkarsList = products.filter(
        p => p.name.toLowerCase().includes('chakkar') || p.name.toLowerCase().includes('wheel') || p.name.toLowerCase().includes('vishnu')
      );
      return {
        text: '🌀 Here are our vibrant spinning Ground Chakkars & Vishnu Wheels (தரை சக்கரம்)! High-speed smooth rotation with brilliant circular fire rings:',
        products: chakkarsList.slice(0, 4),
        actionType: 'link',
        actionText: 'Explore Ground Fireworks →',
        actionUrl: '/products?category=chorsa-kurvi'
      };
    }

    // ---------------------------------------------------------
    // 4. ROCKETS & BOMBS (ராக்கெட் & வெடி)
    // ---------------------------------------------------------
    if (
      q.includes('rocket') ||
      q.includes('rockets') ||
      q.includes('bomb') ||
      q.includes('bombs') ||
      q.includes('thunder') ||
      q.includes('hydro') ||
      q.includes('ராக்கெட்') ||
      q.includes('வெடி') ||
      q.includes('atom')
    ) {
      const rocketsList = products.filter(
        p => p.category === 'bombs-rockets' || p.name.toLowerCase().includes('rocket') || p.name.toLowerCase().includes('bomb')
      );
      return {
        text: '🚀 Here are our whistling Sky Rockets and high-impact Thunder Bombs (ராக்கெட் & வெடி)! Rapid vertical ascension with intense acoustic bursts:',
        products: rocketsList.slice(0, 4),
        actionType: 'link',
        actionText: 'Explore Bombs & Rockets →',
        actionUrl: '/products?category=bombs-rockets'
      };
    }

    // ---------------------------------------------------------
    // 5. AERIAL SHOTS & MULTISHOTS (வானவெடி / வானவேடிக்கை)
    // ---------------------------------------------------------
    if (
      q.includes('shot') ||
      q.includes('shots') ||
      q.includes('aerial') ||
      q.includes('sky shot') ||
      q.includes('multishot') ||
      q.includes('cake') ||
      q.includes('set out') ||
      q.includes('12 shot') ||
      q.includes('30 shot') ||
      q.includes('60 shot') ||
      q.includes('120 shot') ||
      q.includes('வானவெடி') ||
      q.includes('வானவேடிக்கை') ||
      q === 'aerial_shots'
    ) {
      const shotsList = products.filter(p => p.category === 'shots-set-outs');
      return {
        text: '🎆 Here are our grand Multi-Shot Aerial Cakes (வானவெடி)! Automatic sequential sky bursts showering palm breaks, crackling willows, and vibrant colors:',
        products: shotsList.slice(0, 4),
        actionType: 'link',
        actionText: `Explore all ${shotsList.length} Aerial Multishots →`,
        actionUrl: '/products?category=shots-set-outs'
      };
    }

    // ---------------------------------------------------------
    // 6. GIFT BOXES & COMBOS (கிப்ட் பாக்ஸ்)
    // ---------------------------------------------------------
    if (
      q.includes('gift') ||
      q.includes('box') ||
      q.includes('combo') ||
      q.includes('hamper') ||
      q.includes('maharaja') ||
      q.includes('family pack') ||
      q.includes('pack') ||
      q.includes('கிப்ட்') ||
      q.includes('பாக்ஸ்') ||
      q === 'gift_boxes'
    ) {
      const giftBoxes = products.filter(p => p.category === 'gift-boxes');
      return {
        text: '🎁 Here are our luxury Maharaja Diwali Gift Boxes (கிப்ட் பாக்ஸ்)! Fully assorted family celebration hampers containing sparklers, pots, chakkars, and novelties at 80% discount:',
        products: giftBoxes.slice(0, 4),
        actionType: 'link',
        actionText: 'View All Festival Gift Boxes →',
        actionUrl: '/products?category=gift-boxes'
      };
    }

    // ---------------------------------------------------------
    // 7. KIDS & FANCY NOVELTIES (குழந்தைகள் பட்டாசு)
    // ---------------------------------------------------------
    if (
      q.includes('kid') ||
      q.includes('kids') ||
      q.includes('child') ||
      q.includes('children') ||
      q.includes('pencil') ||
      q.includes('drone') ||
      q.includes('helicopter') ||
      q.includes('peacock') ||
      q.includes('siren') ||
      q.includes('snake') ||
      q.includes('twinkling') ||
      q.includes('roll cap') ||
      q.includes('pop') ||
      q.includes('குழந்தை')
    ) {
      const kidsList = products.filter(
        p => p.category === 'fancy-kids' || p.category === 'twinkling-pencils'
      );
      return {
        text: '🦚 Here are our safe, cheerful Kids & Fancy Novelty Fireworks (குழந்தைகள் பட்டாசு)! Colorful peacock fountains, sirens, helicopters, and magic pencils safe for backyard fun:',
        products: kidsList.slice(0, 4),
        actionType: 'link',
        actionText: 'View Kids & Fancy Collection →',
        actionUrl: '/products?category=fancy-kids'
      };
    }

    // ---------------------------------------------------------
    // 8. BIJLI & SOUND CRACKERS (சத்தம் & சரவெடி)
    // ---------------------------------------------------------
    if (
      q.includes('bijli') ||
      q.includes('bijili') ||
      q.includes('sound') ||
      q.includes('titanic') ||
      q.includes('jurassic') ||
      q.includes('chorsa') ||
      q.includes('kurvi') ||
      q.includes('garland') ||
      q.includes('wala') ||
      q.includes('சரவெடி') ||
      q.includes('சத்தம்')
    ) {
      const soundList = products.filter(
        p => p.category === 'bijli-sound' || p.category === 'chorsa-kurvi' || p.category === 'single-sound'
      );
      return {
        text: '💥 Here are our energetic Sound Crackers and Red Bijili (சத்தம் & சரவெடி)! Authentic Sivakasi paper-wrapped rhythmic crackles:',
        products: soundList.slice(0, 4),
        actionType: 'link',
        actionText: 'Explore Sound Crackers →',
        actionUrl: '/products?category=bijli-sound'
      };
    }

    // ---------------------------------------------------------
    // 9. BUDGET / PRICE RANGE (e.g. "under 50", "under 100", "cheap")
    // ---------------------------------------------------------
    const budgetMatch = q.match(/under\s*₹?\s*(\d+)/i) || q.match(/below\s*₹?\s*(\d+)/i) || q.match(/less\s*than\s*₹?\s*(\d+)/i);
    if (budgetMatch) {
      const maxPrice = parseInt(budgetMatch[1], 10);
      const budgetItems = products.filter(p => p.price <= maxPrice).sort((a, b) => a.price - b.price);
      if (budgetItems.length > 0) {
        return {
          text: `🏷️ Here are top-rated fireworks under ₹${maxPrice} (all with flat 80% Sivakasi discount):`,
          products: budgetItems.slice(0, 4),
          actionType: 'link',
          actionText: 'View Complete Price List →',
          actionUrl: '/products'
        };
      }
    }

    // ---------------------------------------------------------
    // 10. SPECIFIC PRODUCT SEARCH FALLBACK
    // ---------------------------------------------------------
    const specificMatches = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.categoryName.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q))
    );

    if (specificMatches.length > 0 && q.length >= 3) {
      return {
        text: `🔍 I searched our 2026 factory inventory and found ${specificMatches.length} item${specificMatches.length > 1 ? 's' : ''} matching "${query}":`,
        products: specificMatches.slice(0, 4),
        actionType: 'link',
        actionText: 'Browse All Matches in Catalogue →',
        actionUrl: `/products?category=all`
      };
    }

    // ---------------------------------------------------------
    // 11. CART & ORDER STATUS
    // ---------------------------------------------------------
    if (q.includes('cart') || q.includes('my order') || q.includes('items') || q === 'cart') {
      if (totalItemsCount === 0) {
        return {
          text: '🛒 Your celebration cart is currently empty! Would you like me to recommend our best-selling sparklers or gift boxes?',
          actionType: 'link',
          actionText: 'Browse Fireworks Catalogue',
          actionUrl: '/products'
        };
      }
      return {
        text: `🛒 You currently have ${totalItemsCount} item${totalItemsCount > 1 ? 's' : ''} in your cart totaling ₹${subtotal.toLocaleString('en-IN')}.\n\n${
          subtotal >= minOrderAmount
            ? '✅ Minimum order requirement qualified! Ready for licensed transport booking.'
            : `⚠️ Minimum order is ₹${minOrderAmount.toLocaleString('en-IN')} (Add ₹${(minOrderAmount - subtotal).toLocaleString('en-IN')} more to unlock transport dispatch).`
        }`,
        actionType: 'link',
        actionText: 'View Cart & Checkout →',
        actionUrl: '/cart'
      };
    }

    // ---------------------------------------------------------
    // 12. MINIMUM ORDER & LOGISTICS
    // ---------------------------------------------------------
    if (q.includes('min') || q.includes('minimum') || q.includes('limit') || q.includes('rule') || q === 'min_order') {
      return {
        text: `📦 Minimum Order Policy:\n\nTo ensure safe and licensed chemical transport from our Sivakasi factory, the minimum dispatch order value is ₹${minOrderAmount.toLocaleString('en-IN')}.\n\n🎉 Special Offer: Orders of ₹3,000+ qualify for Free Licensed Transport Hub Delivery across Tamil Nadu!`,
        actionType: 'link',
        actionText: 'Start Your Order →',
        actionUrl: '/products'
      };
    }

    // ---------------------------------------------------------
    // 13. WHOLESALE & DISCOUNTS (80% OFF)
    // ---------------------------------------------------------
    if (q.includes('discount') || q.includes('offer') || q.includes('wholesale') || q.includes('rate') || q.includes('price') || q === 'discount') {
      return {
        text: '💰 Flat 80% Direct Factory Discount:\n\nSri Natchiyar Crackers offers factory-gate wholesale prices (சிவகாசி நேரடி விற்பனை) directly to consumers, festival organizers, and bulk retail partners. No middlemen markups!',
        actionType: 'link',
        actionText: 'Open Wholesale Catalogue →',
        actionUrl: '/products'
      };
    }

    // ---------------------------------------------------------
    // 14. TRANSPORT & DELIVERY HUBS
    // ---------------------------------------------------------
    if (q.includes('transport') || q.includes('deliver') || q.includes('shipping') || q.includes('chennai') || q.includes('madurai') || q.includes('coimbatore') || q.includes('bangalore') || q.includes('salem') || q.includes('trichy')) {
      return {
        text: '🚚 Fast Licensed Transport Delivery:\n\nWe dispatch daily to all major city transport hubs across Tamil Nadu (Chennai, Madurai, Coimbatore, Trichy, Salem, Tirunelveli, Erode, Vellore, etc.) and Pan-India. Once dispatched, your parcel tracking LR number will be sent for secure city hub collection.',
        actionType: 'link',
        actionText: 'Delivery & Transport Details →',
        actionUrl: '/wholesale'
      };
    }

    // ---------------------------------------------------------
    // 15. CONTACT & PHONE NUMBERS
    // ---------------------------------------------------------
    if (q.includes('call') || q.includes('phone') || q.includes('number') || q.includes('contact') || q.includes('address') || q === 'call') {
      return {
        text: `📍 Sri Natchiyar Crackers (ஸ்ரீ நாச்சியார் பட்டாசு கடை)\nSivakasi Main Road, Virudhunagar District, Tamil Nadu - 626123.\n\n📞 Direct Sales Desk:\n• 99941 00905\n• 94427 01264\n• 93637 79531\n\nDaily 9:00 AM to 9:00 PM for festival & wholesale support!`,
        actionType: 'call',
        actionPhone: STORE_PHONE
      };
    }

    // ---------------------------------------------------------
    // 16. WHATSAPP CONNECT
    // ---------------------------------------------------------
    if (q.includes('whatsapp') || q.includes('human') || q.includes('agent')) {
      const waMsg = totalItemsCount > 0 ? getWhatsAppOrderMessage() : encodeURIComponent('Hello Sri Natchiyar Crackers! I would like to inquire about fireworks wholesale booking.');
      return {
        text: '💬 You can chat directly with our Sivakasi sales executive on WhatsApp for custom festival orders or transport updates.',
        actionType: 'whatsapp',
        actionUrl: `https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`
      };
    }

    // ---------------------------------------------------------
    // 17. PESO GREEN CRACKERS LEGALITY
    // ---------------------------------------------------------
    if (q.includes('legal') || q.includes('peso') || q.includes('green') || q.includes('safe') || q.includes('court')) {
      return {
        text: '🌿 100% Legal PESO Green Crackers:\n\nAll Sri Natchiyar Crackers strictly adhere to Supreme Court guidelines and Petroleum and Explosives Safety Organization (PESO) regulations. Each pack features authentic CSIR-NEERI Green Cracker QR codes with reduced emissions.',
        actionType: 'info'
      };
    }

    // ---------------------------------------------------------
    // DEFAULT PERSONAL SHOPPING ASSISTANT FALLBACK
    // ---------------------------------------------------------
    return {
      text: `I'm happy to help you with that! At Sri Natchiyar Crackers, we provide 99+ factory-direct fireworks varieties with up to 80% discount.\n\nTry asking me for:\n• "Sparklers" or "Flower pots"\n• "Aerial shots" or "Rockets"\n• "Gift boxes" or "Fireworks under 50"\n• "Minimum order" or "Delivery locations"`,
      actionType: 'link',
      actionText: 'Browse Full Catalogue',
      actionUrl: '/products'
    };
  };

  const handleSendMessage = (textToSend) => {
    const messageText = (textToSend || inputValue).trim();
    if (!messageText) return;

    // Append user message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: messageText,
      time: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Realistic typing delay (450ms - 750ms)
    setTimeout(() => {
      const reply = generateBotReply(messageText);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: reply.text,
        products: reply.products || [],
        actionType: reply.actionType,
        actionText: reply.actionText,
        actionUrl: reply.actionUrl,
        actionPhone: reply.actionPhone,
        time: 'Just now'
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 550);
  };

  const handlePromptClick = (prompt) => {
    handleSendMessage(prompt.label);
  };

  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <div
      className={`fixed ${
        totalItemsCount > 0 ? 'bottom-20 sm:bottom-22' : 'bottom-4 sm:bottom-6'
      } right-3 sm:right-6 z-[60] flex flex-col items-end font-sans transition-all duration-300`}
    >
      {/* Interactive Personal Assistant Chat Window */}
      {isOpen && (
        <div className="mb-2 sm:mb-3 w-[calc(100vw-24px)] sm:w-[390px] h-[460px] sm:h-[540px] max-h-[calc(100dvh-170px)] sm:max-h-[80vh] rounded-2xl sm:rounded-3xl bg-white border border-[#0D5C3A]/20 shadow-[0_15px_60px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#062D1B] via-[#0D5C3A] to-[#062D1B] text-white p-3.5 sm:p-4 flex items-center justify-between shrink-0 shadow-sm border-b border-emerald-900/60">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-white/10 border border-emerald-400/30 p-1 flex items-center justify-center shadow-inner">
                  <img
                    src="/assets/natchiyar_square_logo.png"
                    alt="Sri Natchiyar"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#25D366] border-2 border-[#062D1B] rounded-full"></span>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-serif font-black text-sm text-white tracking-wide leading-none">
                    Sri Natchiyar AI
                  </h3>
                  <span className="text-[9px] font-extrabold uppercase tracking-wider bg-yellow-400 text-[#062D1B] px-1.5 py-0.2 rounded font-mono">
                    ASSISTANT
                  </span>
                </div>
                <p className="text-[10px] text-emerald-200 font-medium mt-0.5">
                  Personal Fireworks Shopping Desk • Live
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                title="Restart conversation"
                aria-label="Restart conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                title="Close chat"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#FAF8F5] text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-[#0D5C3A] text-white rounded-br-xs'
                      : 'bg-white border border-[#EAE3D6] text-gray-800 rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line text-[12px]">{msg.text}</p>

                  {/* Interactive Mini Product Cards Recommended by AI */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="mt-3 space-y-2 w-full">
                      {msg.products.map((prod) => {
                        const isAlreadyInCart = cartItems.some(i => i.id === prod.id);
                        const isJustAdded = addedItemIds[prod.id];

                        return (
                          <div
                            key={prod.id}
                            className="p-2 sm:p-2.5 rounded-xl bg-[#FAFDFB] border border-emerald-100/80 hover:border-[#0D5C3A]/40 shadow-2xs transition-all flex items-center justify-between gap-2"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[9px] font-mono font-bold bg-emerald-50 text-[#0D5C3A] px-1.5 py-0.2 rounded border border-emerald-200">
                                  #{prod.no}
                                </span>
                                <h4 className="font-serif font-bold text-gray-900 text-[11px] truncate">
                                  {prod.name}
                                </h4>
                              </div>
                              <div className="flex items-center gap-1.5 mt-0.5 text-[10px] flex-wrap">
                                <span className="text-gray-500 font-mono text-[9px]">{prod.packSize}</span>
                                <span className="font-extrabold text-[#0D5C3A] font-sans">₹{prod.price}</span>
                                <span className="text-gray-400 line-through font-mono text-[9px]">₹{prod.mrp}</span>
                                <span className="text-[8px] font-bold text-[#2E7D32] bg-emerald-50 px-1 rounded">80% OFF</span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleAddProductToCart(prod)}
                              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all shrink-0 flex items-center gap-1 shadow-2xs active:scale-95 ${
                                isJustAdded || isAlreadyInCart
                                  ? 'bg-[#2E7D32] text-white hover:bg-[#1B5E20]'
                                  : 'bg-[#0D5C3A] hover:bg-[#073822] text-white'
                              }`}
                            >
                              {isJustAdded ? (
                                <>
                                  <Check className="w-3 h-3 stroke-[2.5]" />
                                  <span>Added!</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3 h-3 stroke-[2.5]" />
                                  <span>{isAlreadyInCart ? '+1 More' : 'Add'}</span>
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Contextual Action Link / Call Button */}
                  {msg.actionType === 'link' && msg.actionUrl && (
                    <Link
                      to={msg.actionUrl}
                      onClick={() => setIsOpen(false)}
                      className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0D5C3A] hover:bg-[#073822] text-white font-bold text-[11px] shadow-xs transition-colors"
                    >
                      <span>{msg.actionText}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  )}

                  {msg.actionType === 'call' && (
                    <a
                      href={`tel:${msg.actionPhone || STORE_PHONE}`}
                      className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0D5C3A] hover:bg-[#073822] text-white font-bold text-[11px] shadow-xs transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Sivakasi: {msg.actionPhone || STORE_PHONE}</span>
                    </a>
                  )}

                  {msg.actionType === 'whatsapp' && (
                    <a
                      href={msg.actionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-[11px] shadow-xs transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat on WhatsApp Desk</span>
                    </a>
                  )}
                </div>
                <span className="text-[9px] text-gray-400 mt-0.5 px-1">{msg.time}</span>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-1.5 bg-white border border-[#EAE3D6] text-gray-500 rounded-2xl px-3.5 py-2.5 w-fit shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-[10px] text-gray-400 font-medium ml-1">Assistant searching products...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips Carousel */}
          <div className="p-2 bg-[#F4F1EA] border-t border-[#EAE3D6] overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0 select-none">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt.id}
                onClick={() => handlePromptClick(prompt)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white hover:bg-emerald-50 border border-gray-200 hover:border-emerald-400 text-gray-700 hover:text-[#0D5C3A] text-[10px] font-bold transition-all shrink-0 shadow-2xs active:scale-95"
              >
                {prompt.label}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 bg-white border-t border-gray-100 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="e.g. I need sparklers, flower pots, under 1000..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[#0D5C3A] focus:ring-1 focus:ring-[#0D5C3A]"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-2 rounded-xl bg-[#0D5C3A] hover:bg-[#073822] text-white disabled:opacity-40 disabled:hover:bg-[#0D5C3A] transition-colors shadow-2xs"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Chat Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Sri Natchiyar Fireworks Assistant Chatbot"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-[#062D1B] via-[#0D5C3A] to-[#15803D] hover:from-[#042013] hover:to-[#0D5C3A] text-white border-2 border-white shadow-[0_6px_25px_rgba(13,92,58,0.5)] transition-all duration-300 hover:scale-108 active:scale-95 cursor-pointer"
      >
        {/* Pulsing ring animation */}
        <span className="absolute -inset-1 rounded-full bg-emerald-500/30 animate-ping pointer-events-none"></span>

        {/* Unread indicator */}
        {hasUnread && !isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 border-2 border-white rounded-full flex items-center justify-center shadow-xs">
            <span className="w-1.5 h-1.5 bg-[#062D1B] rounded-full"></span>
          </span>
        )}

        {isOpen ? (
          <X className="w-6 h-6 text-white transition-transform duration-200 group-hover:rotate-90" />
        ) : (
          <div className="relative flex items-center justify-center">
            {/* Friendly Chat Bubble with Sparkler Bot Accent */}
            <MessageSquare className="w-6 h-6 text-white stroke-[2.2]" />
            <Sparkles className="w-3 h-3 text-yellow-300 absolute -top-1.5 -right-1.5 animate-pulse" />
          </div>
        )}

        <span className="sr-only">Toggle Fireworks Assistant Chat</span>
      </button>
    </div>
  );
};

export default ChatBot;

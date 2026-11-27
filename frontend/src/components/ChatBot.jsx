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
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const STORE_PHONE = '9994100905';
const STORE_PHONE_2 = '9442701264';
const STORE_PHONE_3 = '9363779531';
const WHATSAPP_NUMBER = '919994100905';

// Pre-defined quick prompt chips
const QUICK_PROMPTS = [
  { id: 'catalogue', label: '🎆 View Price List & Catalog', icon: Sparkles },
  { id: 'min_order', label: '📦 Minimum Order & Delivery', icon: Truck },
  { id: 'discount', label: '💰 80% Wholesale Discount', icon: ShieldCheck },
  { id: 'transport', label: '🚚 Transport Hub Locations', icon: Truck },
  { id: 'cart', label: '🛒 Check My Cart', icon: ShoppingBag },
  { id: 'call', label: '📞 Call Sivakasi Desk', icon: Phone },
  { id: 'whatsapp', label: '💬 Talk on WhatsApp', icon: MessageSquare }
];

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'bot',
    text: 'Vanakkam! 🙏 Welcome to Sri Natchiyar Crackers (ஸ்ரீ நாச்சியார் பட்டாசு கடை), Sivakasi! How can I assist you with your festival celebration or wholesale booking today?',
    time: 'Just now'
  }
];

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const messagesEndRef = useRef(null);

  const { cartItems, totalItemsCount, subtotal, minOrderAmount, getWhatsAppOrderMessage } = useCart();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
    }
  }, [messages, isOpen]);

  // Knowledge base response generator
  const generateBotReply = (query) => {
    const q = query.toLowerCase().trim();

    // 1. Cart Inquiry
    if (q.includes('cart') || q.includes('my order') || q.includes('items') || q === 'cart') {
      if (totalItemsCount === 0) {
        return {
          text: 'Your celebration cart is currently empty! Explore our wholesale catalog to add sparklers, flower pots, and aerial shots at 80% discount.',
          actionType: 'link',
          actionText: 'Explore Fireworks Catalogue',
          actionUrl: '/products'
        };
      }
      return {
        text: `You have ${totalItemsCount} item${totalItemsCount > 1 ? 's' : ''} in your cart totaling ₹${subtotal.toLocaleString('en-IN')}. ${
          subtotal >= minOrderAmount
            ? '✅ Minimum order requirement qualified! Ready for transport booking.'
            : `⚠️ Minimum order is ₹${minOrderAmount.toLocaleString('en-IN')} (Add ₹${(minOrderAmount - subtotal).toLocaleString('en-IN')} more to qualify).`
        }`,
        actionType: 'link',
        actionText: 'View Cart & Checkout',
        actionUrl: '/cart'
      };
    }

    // 2. Minimum Order & Delivery
    if (q.includes('min') || q.includes('minimum') || q.includes('order limit') || q === 'min_order') {
      return {
        text: `📦 Minimum Order Requirement: ₹${minOrderAmount.toLocaleString('en-IN')}.\n\nAs per PESO legal guidelines, fireworks are dispatched directly from our Sivakasi factory via licensed parcel transport services. Orders of ₹3,000+ also unlock Free Transport Hub Delivery!`,
        actionType: 'link',
        actionText: 'Browse Fireworks',
        actionUrl: '/products'
      };
    }

    // 3. Wholesale & Discounts
    if (q.includes('discount') || q.includes('offer') || q.includes('wholesale') || q.includes('price') || q.includes('rate') || q === 'discount') {
      return {
        text: '💰 Sri Natchiyar Crackers provides genuine Factory-Direct Wholesale Pricing (சிவகாசி நேரடி விற்பனை) with up to 80% OFF on all festival varieties for retail families, shops, and function bookings!',
        actionType: 'link',
        actionText: 'View Discounted Price List',
        actionUrl: '/products'
      };
    }

    // 4. Transport & Delivery Hubs
    if (q.includes('transport') || q.includes('deliver') || q.includes('shipping') || q.includes('chennai') || q.includes('madurai') || q.includes('coimbatore') || q === 'transport') {
      return {
        text: '🚚 Fast Licensed Transport Delivery:\n\nWe dispatch daily to all major transport hubs across Tamil Nadu (Chennai, Madurai, Coimbatore, Trichy, Salem, Tirunelveli, Erode, Vellore, etc.) and Pan-India. You can collect your parcel securely at your nearest city hub with the LR copy.',
        actionType: 'link',
        actionText: 'Transport & Delivery Info',
        actionUrl: '/wholesale'
      };
    }

    // 5. Products & Catalogue
    if (q.includes('product') || q.includes('sparkler') || q.includes('flower pot') || q.includes('rocket') || q.includes('shot') || q.includes('gift box') || q.includes('catalogue') || q.includes('catalog') || q === 'catalogue') {
      return {
        text: '🎆 We manufacture and distribute 99+ certified Sivakasi varieties:\n\n• Sparklers (Electric, Colour, Green, 10cm - 50cm)\n• Volcanic Flower Pots & Ashoka Tins\n• Ground Chakkars & Vishnu Wheels\n• Whistling Rockets & Sky Rockets\n• High Aerial Multishots (12, 30, 60, 120 Shots)\n• Maharaja Festival Gift Boxes',
        actionType: 'link',
        actionText: 'Open Full Product Catalogue',
        actionUrl: '/products'
      };
    }

    // 6. PESO & Legal Green Crackers
    if (q.includes('legal') || q.includes('peso') || q.includes('green') || q.includes('license') || q.includes('safe') || q.includes('court')) {
      return {
        text: '🌿 100% Legal PESO Green Crackers:\n\nEvery product from Sri Natchiyar Crackers complies with Petroleum and Explosives Safety Organization (PESO) regulations and the Hon’ble Supreme Court directives. All boxes contain CSIR-NEERI authenticated Green Cracker QR codes with reduced emissions.',
        actionType: 'info'
      };
    }

    // 7. Contact, Phone & Call
    if (q.includes('call') || q.includes('phone') || q.includes('number') || q.includes('contact') || q.includes('address') || q.includes('location') || q === 'call') {
      return {
        text: `📍 Sri Natchiyar Crackers (ஸ்ரீ நாச்சியார் பட்டாசு கடை)\nSivakasi Main Road, Virudhunagar Dist, Tamil Nadu - 626123.\n\n📞 Direct Sales Desk:\n• 99941 00905\n• 94427 01264\n• 93637 79531\n\nOur team is available 9 AM - 9 PM daily for wholesale and festive bookings!`,
        actionType: 'call',
        actionPhone: STORE_PHONE
      };
    }

    // 8. WhatsApp Assistance
    if (q.includes('whatsapp') || q.includes('chat') || q.includes('human') || q.includes('person') || q.includes('agent') || q === 'whatsapp') {
      const waMsg = totalItemsCount > 0 ? getWhatsAppOrderMessage() : encodeURIComponent('Hello Sri Natchiyar Crackers! I would like to inquire about fireworks wholesale booking.');
      return {
        text: '💬 You can chat directly with our Sivakasi sales desk on WhatsApp for instant estimate verification, customized gift boxes, or transport hub status.',
        actionType: 'whatsapp',
        actionUrl: `https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`
      };
    }

    // Default Fallback
    return {
      text: `Thank you for reaching out! Sri Natchiyar Crackers offers factory-direct wholesale fireworks with up to 80% discount. Feel free to browse our online catalog, or reach our Sivakasi desk directly at +91 99941 00905 / WhatsApp.`,
      actionType: 'link',
      actionText: 'Browse Online Catalogue',
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

    // Realistic typing delay (450ms - 800ms)
    setTimeout(() => {
      const reply = generateBotReply(messageText);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: reply.text,
        actionType: reply.actionType,
        actionText: reply.actionText,
        actionUrl: reply.actionUrl,
        actionPhone: reply.actionPhone,
        time: 'Just now'
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
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
        totalItemsCount > 0 ? 'bottom-[130px] sm:bottom-22' : 'bottom-6'
      } right-4 sm:right-6 z-[60] flex flex-col items-end font-sans transition-all duration-300`}
    >
      {/* Interactive Chat Window */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-32px)] sm:w-[380px] h-[460px] sm:h-[520px] max-h-[calc(100dvh-160px)] sm:max-h-[80vh] rounded-3xl bg-white border border-[#0D5C3A]/20 shadow-[0_15px_60px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
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
                    LIVE
                  </span>
                </div>
                <p className="text-[10px] text-emerald-200 font-medium mt-0.5">
                  Sivakasi Factory Support • Instant Help
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
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-[#0D5C3A] text-white rounded-br-xs'
                      : 'bg-white border border-[#EAE3D6] text-gray-800 rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line text-[12px]">{msg.text}</p>

                  {/* Contextual Action Button */}
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
                      <span>Chat on WhatsApp</span>
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
                <span className="text-[10px] text-gray-400 font-medium ml-1">Assistant typing...</span>
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
              placeholder="Ask about crackers, prices, delivery..."
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

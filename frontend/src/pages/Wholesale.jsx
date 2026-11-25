import React, { useState } from 'react';
import { motion } from 'framer-motion';
import apiService from '../services/api';
import toast from 'react-hot-toast';
import {
  Building2,
  PhoneCall,
  Send,
  MessageCircle,
  Truck,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
  Download,
  Flame,
  Percent
} from 'lucide-react';

const Wholesale = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    contactPerson: '',
    phone: '',
    email: '',
    categories: ['Gift Boxes & Combos', 'Aerial Sky Shots'],
    estimatedBudget: '₹50,000 - ₹1,00,000',
    location: '',
    state: 'Tamil Nadu',
    requirements: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState(null);

  const availableCategories = [
    'Sparklers (All sizes)',
    'Flower Pots & Fountains',
    'Ground Chakkars',
    'Aerial Sky Shots & Multi-Cakes',
    'Sky Rockets',
    'Gift Boxes & Combos',
    'Fancy Novelties & Spinners',
    'Loose Sound Crackers'
  ];

  const handleCategoryToggle = (cat) => {
    setFormData(prev => {
      const exists = prev.categories.includes(cat);
      if (exists) {
        return { ...prev, categories: prev.categories.filter(c => c !== cat) };
      } else {
        return { ...prev, categories: [...prev.categories, cat] };
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.businessName.trim() || !formData.contactPerson.trim() || !formData.phone.trim() || !formData.location.trim()) {
      toast.error('Please fill in all required business and contact details.');
      return;
    }

    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      toast.error('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiService.submitWholesaleEnquiry(formData);
      if (res.success) {
        setSubmittedRef(res.quoteRef || `SNC-B2B-${Date.now().toString().slice(-6)}`);
        toast.success(res.message || 'Wholesale quotation request received!');
      } else {
        toast.error('Unable to send enquiry. Please contact us via WhatsApp at 9994100905.');
      }
    } catch {
      toast.error('Network connection issue. Please connect via direct WhatsApp at 9994100905.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Sri Natchiyar Crackers Sivakasi!\n\nI want to inquire about B2B Wholesale Dealership.\n\nBusiness: ${formData.businessName || 'My Enterprise'}\nContact: ${formData.contactPerson || 'Proprietor'}\nPhone: ${formData.phone || 'Pending'}\nLocation: ${formData.location || 'India'}\nEstimated Budget: ${formData.estimatedBudget}\n\nPlease share your wholesale PDF price list.`
  );

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-gray-900 pt-40 sm:pt-48 pb-20">
      {/* Header */}
      <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 mb-16 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-[#0D5C3A] px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 inline-block mb-3">
       B2B Trade &amp; Bulk Distributorship
        </span>
        <h1 className="font-sans text-3xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-4">
          Wholesale <span className="text-[#0D5C3A]">Enquiry</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
          Partner directly with <strong>ஸ்ரீ நாச்சியார் பட்டாசு கடை (Sri Natchiyar Crackers)</strong> Sivakasi. We supply authorized dealers, corporate buyers, and festival retailers across India with authentic factory-direct wholesale pricing and licensed transport.
        </p>
      </div>

      <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Benefits & WhatsApp Quick Connect */}
          <div className="lg:col-span-5 space-y-6">
            {/* Wholesale Benefits Card */}
            <div className="p-8 rounded-3xl bg-white border border-emerald-100 shadow-md">
              <h3 className="font-sans text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Percent className="w-5 h-5 text-[#0D5C3A]" />
                <span>Wholesale Tier Privileges</span>
              </h3>
              <ul className="space-y-4 text-xs sm:text-sm text-gray-600">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>சிவகாசி நேரடி கம்பெனி விலை:</strong> Genuine factory-gate savings off standard retail prices on carton bookings.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Custom Brand Gift Boxes:</strong> Corporate festival gift hampers customized for employees and business associates.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Licensed Sivakasi Logistics:</strong> Safe transport via certified explosive carrier hubs across all districts.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Direct Factory Assurance:</strong> Reliable burst quality, dry packing, and fresh festival production.</span>
                </li>
              </ul>

              {/* Direct WhatsApp Callout */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">
                  Prefer Instant WhatsApp Negotiation?
                </p>
                <a
                  href={`https://wa.me/919994100905?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Chat With Wholesale Manager: 99941 00905</span>
                </a>
              </div>
            </div>

            {/* Direct Sivakasi Factory Office Box */}
            <div className="p-6 rounded-2xl bg-white border border-emerald-100 shadow-sm flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-emerald-50 text-[#0D5C3A] shrink-0 border border-emerald-100">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-sans text-sm font-bold text-gray-900">Sivakasi Sales Hotlines</h4>
                <div className="text-xs text-gray-700 mt-1 space-y-0.5">
                  <p><strong>+91 99941 00905</strong> (WhatsApp / Primary)</p>
                  <p>+91 94427 01264</p>
                  <p>+91 93637 79531</p>
                </div>
                <p className="text-[11px] text-[#CA8A04] mt-1.5 font-bold">Mon - Sun (8:00 AM - 9:30 PM)</p>
              </div>
            </div>
          </div>

          {/* Right Column: Wholesale Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-emerald-100 shadow-xl relative">
              {submittedRef ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-200">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-sans text-2xl font-bold text-gray-900">Enquiry Received!</h3>
                  <p className="text-sm text-gray-600 max-w-md mx-auto">
                    Your wholesale enquiry reference number is <strong className="text-[#0D5C3A] font-mono">{submittedRef}</strong>. Our Sivakasi B2B sales desk will contact you shortly with customized tier pricing.
                  </p>
                  <div className="pt-4 flex justify-center gap-4">
                    <button
                      onClick={() => setSubmittedRef(null)}
                      className="px-6 py-2.5 rounded-xl bg-gray-700 text-white text-xs font-bold hover:bg-gray-800"
                    >
                      Submit Another Query
                    </button>
                    <a
                      href={`https://wa.me/919994100905?text=${encodeURIComponent(`Hi Sri Natchiyar Crackers, checking status for wholesale ref: ${submittedRef}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2.5 rounded-xl bg-[#0D5C3A] text-white text-xs font-bold hover:bg-[#073822] transition-colors"
                    >
                      Follow Up on WhatsApp
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Business Name */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                        Business / Store Name *
                      </label>
                      <input
                        type="text"
                        name="businessName"
                        required
                        value={formData.businessName}
                        onChange={handleInputChange}
                        placeholder="e.g. Sri Lakshmi Crackers & Traders"
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:bg-white focus:border-[#0D5C3A] focus:ring-1 focus:ring-[#0D5C3A]"
                      />
                    </div>

                    {/* Contact Person */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                        Contact Person Name *
                      </label>
                      <input
                        type="text"
                        name="contactPerson"
                        required
                        value={formData.contactPerson}
                        onChange={handleInputChange}
                        placeholder="e.g. S. Ramanathan"
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:bg-white focus:border-[#0D5C3A] focus:ring-1 focus:ring-[#0D5C3A]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Mobile Number */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                        Mobile Number (WhatsApp) *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="e.g. 9994100905"
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:bg-white focus:border-[#0D5C3A] focus:ring-1 focus:ring-[#0D5C3A]"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="dealer@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:bg-white focus:border-[#0D5C3A] focus:ring-1 focus:ring-[#0D5C3A]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* City / Location */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                        City / District / Town *
                      </label>
                      <input
                        type="text"
                        name="location"
                        required
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="e.g. Madurai / Chennai / Bengaluru"
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:bg-white focus:border-[#0D5C3A] focus:ring-1 focus:ring-[#0D5C3A]"
                      />
                    </div>

                    {/* Estimated Order Budget */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                        Estimated Order Volume
                      </label>
                      <select
                        name="estimatedBudget"
                        value={formData.estimatedBudget}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:outline-none focus:bg-white focus:border-[#0D5C3A] cursor-pointer"
                      >
                        <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000 (Starter Batch)</option>
                        <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000 (Retail Store)</option>
                        <option value="₹1,00,000 - ₹3,00,000">₹1,00,000 - ₹3,00,000 (Major Dealer)</option>
                        <option value="Above ₹3,00,000">Above ₹3,00,000 (Full Container / Distributor)</option>
                      </select>
                    </div>
                  </div>

                  {/* Required Product Categories Multi-Select */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      Required Categories (Select All That Apply):
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {availableCategories.map(cat => {
                        const isSelected = formData.categories.includes(cat);
                        return (
                          <button
                            type="button"
                            key={cat}
                            onClick={() => handleCategoryToggle(cat)}
                            className={`p-2.5 rounded-xl text-xs font-bold text-left flex items-center justify-between border transition-all ${
                              isSelected
                                ? 'bg-emerald-50 border-[#0D5C3A] text-[#0D5C3A]'
                                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <span>{cat}</span>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#0D5C3A]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Additional Requirements */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      Additional Requirements / Transport Hub Preference
                    </label>
                    <textarea
                      name="requirements"
                      rows={3}
                      value={formData.requirements}
                      onChange={handleInputChange}
                      placeholder="Specify transport service preference, desired delivery timeframe, or particular cracker items..."
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:bg-white focus:border-[#0D5C3A] focus:ring-1 focus:ring-[#0D5C3A] resize-none"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#0D5C3A] via-[#15803D] to-[#0D5C3A] hover:from-[#15803D] hover:to-[#073822] text-white font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-xl shadow-[#0D5C3A]/20 border border-emerald-500/40 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 text-white" />
                    <span>{isSubmitting ? 'Transmitting Request...' : 'Submit Wholesale Quotation Request'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wholesale;
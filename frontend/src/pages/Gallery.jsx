import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const galleryPhotos = [
  {
    id: 1,
    title: '240 Shot Mega Sky Symphony',
    category: 'aerial',
    categoryLabel: 'Aerial Fireworks',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80',
    description: 'Brocade golden willows and vivid emerald sparks illuminating festive night skies.'
  },
  {
    id: 2,
    title: 'Ashoka Giant Volcanic Fountain',
    category: 'fountains',
    categoryLabel: 'Flower Pots & Fountains',
    image: 'https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?auto=format&fit=crop&w=1200&q=80',
    description: '15-foot high cascade of shimmering silver and golden sparks.'
  },
  {
    id: 3,
    title: 'Electric Sparklers Family Celebration',
    category: 'sparklers',
    categoryLabel: 'Sparklers',
    image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80',
    description: 'Safe, joyous sparkler moments captured during family Diwali festivities.'
  },
  {
    id: 4,
    title: 'Dynamic Spinning Ground Chakkars',
    category: 'ground',
    categoryLabel: 'Ground Chakkars',
    image: 'https://images.unsplash.com/photo-1531747056595-07f6cbbe10ad?auto=format&fit=crop&w=1200&q=80',
    description: 'Continuous circular vortex of golden fire on court grounds.'
  },
  {
    id: 5,
    title: 'Whistling High Altitude Rocket Launch',
    category: 'aerial',
    categoryLabel: 'Aerial Fireworks',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    description: 'Twin-bang high thrust sky rockets painting vibrant chromatic trails.'
  },
  {
    id: 6,
    title: 'Royal Wedding Sky Celebration',
    category: 'festivals',
    categoryLabel: 'Grand Celebrations',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80',
    description: 'Synchronized aerial display for a grand wedding celebration in South India.'
  },
  {
    id: 7,
    title: 'Sri Natchiyar Supreme Hamper Display',
    category: 'festivals',
    categoryLabel: 'Grand Celebrations',
    image: 'https://images.unsplash.com/photo-1513297887119-d46091b24bfa?auto=format&fit=crop&w=1200&q=80',
    description: 'Our signature gift hamper ready for auspicious festive family gifting.'
  },
  {
    id: 8,
    title: 'Peacock Feather Fountain Spectrum',
    category: 'fountains',
    categoryLabel: 'Flower Pots & Fountains',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80',
    description: 'Multi-directional iridescent star spread displaying royal peacock splendour.'
  },
  {
    id: 9,
    title: 'Festival of Lights Nightfall',
    category: 'festivals',
    categoryLabel: 'Grand Celebrations',
    image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=1200&q=80',
    description: 'Traditional earthen lamps and sparkling fireworks celebrating Deepavali.'
  }
];

const Gallery = () => {
  const [filter, setFilter] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const filterTabs = [
    { id: 'all', label: 'All Photos' },
    { id: 'aerial', label: 'Aerial & Sky Shots' },
    { id: 'fountains', label: 'Fountains & Pots' },
    { id: 'sparklers', label: 'Sparklers' },
    { id: 'ground', label: 'Ground Chakkars' },
    { id: 'festivals', label: 'Grand Celebrations' },
  ];

  const filteredPhotos = filter === 'all'
    ? galleryPhotos
    : galleryPhotos.filter(p => p.category === filter);

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-gray-900 pt-40 sm:pt-48 pb-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-[#0D5C3A] px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 inline-block mb-3">
        Festive Brilliance In Action
        </span>
        <h1 className="font-sans text-3xl sm:text-5xl font-black text-gray-900 mb-4">
          Celebration <span className="forest-gradient-text">Gallery</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
          Immerse yourself in breathtaking captures of <strong>ஸ்ரீ நாச்சியார் பட்டாசு கடை (Sri Natchiyar Crackers)</strong> lighting up weddings, festivals, and family celebrations across India.
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
          {filterTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === tab.id
                  ? 'bg-[#0D5C3A] text-white border border-[#0D5C3A] shadow-md'
                  : 'bg-white hover:bg-emerald-50 text-gray-700 border border-emerald-100 shadow-sm'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo, idx) => (
            <motion.div
              key={photo.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              onClick={() => setLightboxIndex(idx)}
              className="group relative rounded-2xl overflow-hidden bg-white aspect-4/3 cursor-pointer border border-emerald-100 hover:border-[#0D5C3A]/60 shadow-lg hover:shadow-2xl transition-all"
            >
              <img
                src={photo.image}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300"></div>

              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                <div>
                  <span className="text-[11px] font-bold text-yellow-300 uppercase tracking-wider block mb-1">
                    {photo.categoryLabel}
                  </span>
                  <h3 className="font-sans text-base sm:text-lg font-bold text-white group-hover:text-yellow-300 transition-colors">
                    {photo.title}
                  </h3>
                </div>
                <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-md group-hover:bg-yellow-400 group-hover:text-[#073822] text-white transition-colors shrink-0">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Interactive Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/95 backdrop-blur-xl">
            {/* Close Button */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-20 cursor-pointer"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev Button */}
            <button
              onClick={() => setLightboxIndex((lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length)}
              className="absolute left-4 sm:left-8 p-3.5 rounded-full bg-white/10 hover:bg-emerald-600 hover:text-white text-white transition-colors z-20 cursor-pointer"
              aria-label="Previous Photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Button */}
            <button
              onClick={() => setLightboxIndex((lightboxIndex + 1) % filteredPhotos.length)}
              className="absolute right-4 sm:right-8 p-3.5 rounded-full bg-white/10 hover:bg-emerald-600 hover:text-white text-white transition-colors z-20 cursor-pointer"
              aria-label="Next Photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Content Container */}
            <div className="max-w-4xl max-h-[85vh] flex flex-col items-center">
              <img
                src={filteredPhotos[lightboxIndex].image}
                alt={filteredPhotos[lightboxIndex].title}
                className="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl border border-yellow-400/40"
              />
              <div className="mt-5 text-center px-4">
                <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest">
                  {filteredPhotos[lightboxIndex].categoryLabel}
                </span>
                <h3 className="font-sans text-xl sm:text-2xl font-bold text-white mt-1">
                  {filteredPhotos[lightboxIndex].title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 max-w-lg mt-1 mx-auto">
                  {filteredPhotos[lightboxIndex].description}
                </p>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
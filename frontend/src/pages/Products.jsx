import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products } from '../data/products';
import { categories } from '../data/categories';
import { useCart } from '../context/CartContext';
import {
  Search,
  ArrowUpDown,
  Sparkles,
  Minus,
  Plus,
  X
} from 'lucide-react';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';

  const { cartItems, setItemQuantity, incrementItem, decrementItem } = useCart();

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('no'); // 'no', 'name', 'price', 'mrp'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Synchronize state when URL category query param changes
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
      setCurrentPage(1);
    }
  }, [categoryParam]);

  const handleCategorySelect = (slug) => {
    setSelectedCategory(slug);
    setSearchParams(slug === 'all' ? {} : { category: slug });
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Filter & Sort Logic
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Search query filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        (p.packSize && p.packSize.toLowerCase().includes(q)) ||
        (p.tag && p.tag.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Sorting
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'no') {
        comparison = (a.no || 0) - (b.no || 0);
      } else if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'price') {
        comparison = a.price - b.price;
      } else if (sortField === 'mrp') {
        comparison = a.mrp - b.mrp;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [selectedCategory, searchQuery, sortField, sortOrder]);

  // Pagination calculation
  const totalItems = filteredAndSortedProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedProducts = filteredAndSortedProducts.slice(startIndex, startIndex + itemsPerPage);

  const getProductQuantity = (productId) => {
    const found = cartItems.find(item => item.id === productId);
    return found ? found.quantity : 0;
  };

  const handleInputChange = (product, val) => {
    if (val === '') {
      setItemQuantity(product, 0);
      return;
    }
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      setItemQuantity(product, Math.min(parsed, 999));
    }
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen text-gray-900 pt-40 sm:pt-48 pb-24 font-sans">
      {/* Header Banner */}
      <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 mb-8 text-center">
        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#CA8A04] px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 inline-block mb-3">
        சிவகாசி கம்பெனியின் நேரடி விற்பனை
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-black text-[#0D5C3A] mb-3 tracking-tight">
          Sri Natchiyar Crackers <span className="text-[#CA8A04]">Catalogue</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Explore our certified Sivakasi fireworks in an organized wholesale table format. Select quantities with live subtotal calculation and direct WhatsApp order booking.
        </p>
      </div>

      {/* Control Toolbar: Search & Category Filter Pills */}
      <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 mb-6">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-emerald-100 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by name, category, or pack size (e.g. sparklers, flower pots, 100 pcs)..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#FAFDFB] border border-emerald-200 text-gray-900 placeholder-gray-400 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-[#0D5C3A] focus:ring-1 focus:ring-[#0D5C3A]"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Results Counter Pill */}
            <div className="flex items-center gap-2 self-end md:self-center shrink-0">
              <span className="bg-emerald-50 border border-emerald-200 text-gray-700 text-xs font-bold px-3 py-2 rounded-lg whitespace-nowrap shadow-2xs">
                Showing <strong className="text-[#0D5C3A]">{displayedProducts.length}</strong> of{' '}
                <strong className="text-gray-900">{totalItems}</strong> varieties
              </span>
            </div>
          </div>

          {/* Category Horizontal Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar select-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 border shrink-0 ${
                    isActive
                      ? 'bg-[#0D5C3A] text-white border-[#0D5C3A] shadow-xs'
                      : 'bg-white hover:bg-emerald-50 text-gray-700 border-emerald-200/80 hover:border-[#0D5C3A]/60'
                  }`}
                >
                  <span>{cat.name}</span>
                  {cat.slug !== 'all' && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {cat.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Table Container (Image-Free List Format with Steppers & Row Total) */}
      <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16">
        <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
              {/* Table Header Row */}
              <thead>
                <tr className="bg-emerald-50/70 border-b border-emerald-100 text-gray-800 text-[11px] sm:text-xs font-extrabold uppercase tracking-wider select-none">
                  <th
                    onClick={() => handleSort('no')}
                    className="py-3.5 px-4 cursor-pointer hover:text-[#0D5C3A] whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1">
                      <span>S.NO</span>
                      <ArrowUpDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </th>

                  <th
                    onClick={() => handleSort('name')}
                    className="py-3.5 px-5 cursor-pointer hover:text-[#0D5C3A] whitespace-nowrap min-w-[240px]"
                  >
                    <div className="flex items-center gap-1">
                      <span>PRODUCT NAME</span>
                      <ArrowUpDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </th>

                  <th className="py-3.5 px-4 whitespace-nowrap">
                    CATEGORY
                  </th>

                  <th className="py-3.5 px-4 whitespace-nowrap">
                    PACK SIZE
                  </th>

                  <th
                    onClick={() => handleSort('mrp')}
                    className="py-3.5 px-4 cursor-pointer hover:text-[#0D5C3A] whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1">
                      <span>MRP</span>
                      <ArrowUpDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </th>

                  <th
                    onClick={() => handleSort('price')}
                    className="py-3.5 px-4 cursor-pointer hover:text-[#0D5C3A] whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1">
                      <span>SELLING PRICE</span>
                      <ArrowUpDown className="w-3 h-3 text-[#0D5C3A]" />
                    </div>
                  </th>

                  <th className="py-3.5 px-4 text-center whitespace-nowrap min-w-[140px]">
                    QUANTITY
                  </th>

                  <th className="py-3.5 px-5 text-right whitespace-nowrap min-w-[120px]">
                    TOTAL (₹)
                  </th>
                </tr>
              </thead>

              {/* Table Body Rows */}
              <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
                {displayedProducts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-gray-500">
                      <Sparkles className="w-10 h-10 text-yellow-500 mx-auto mb-3 opacity-50" />
                      <p className="font-bold text-gray-900 text-base">No fireworks matched your search</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Try searching for a different term or select "All Fireworks"
                      </p>
                      <button
                        onClick={() => {
                          setSelectedCategory('all');
                          setSearchQuery('');
                          setSearchParams({});
                          setCurrentPage(1);
                        }}
                        className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-[#0D5C3A] text-white hover:bg-[#073822] transition-colors"
                      >
                        Reset Filters
                      </button>
                    </td>
                  </tr>
                ) : (
                  displayedProducts.map((product) => {
                    const discountPercent = product.mrp > product.price
                      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
                      : 0;
                    const currentQty = getProductQuantity(product.id);
                    const itemTotal = currentQty * product.price;

                    return (
                      <tr
                        key={product.id}
                        className={`hover:bg-emerald-50/40 transition-colors group ${
                          currentQty > 0 ? 'bg-[#FAFDFB]' : ''
                        }`}
                      >
                        {/* S.No */}
                        <td className="py-4 px-4 font-bold text-gray-700 font-mono">
                          {product.no}
                        </td>

                        {/* Product Name with IN STOCK & Festive Choice */}
                        <td className="py-4 px-5">
                          <span className="font-serif font-bold text-gray-900 text-sm sm:text-base leading-snug block">
                            {product.name}
                          </span>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <span className="bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                              IN STOCK
                            </span>
                            <span className="text-[#CA8A04] text-[11px] font-semibold flex items-center gap-1">
                              <span>★</span>
                              <span>Festive Choice</span>
                            </span>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="text-[#0D5C3A] font-bold text-xs uppercase tracking-wider">
                            {product.categoryName?.toUpperCase() || 'FIREWORKS'}
                          </span>
                        </td>

                        {/* Pack Size */}
                        <td className="py-4 px-4 whitespace-nowrap text-gray-600 font-medium font-mono text-xs">
                          {product.packSize || '1 Unit'}
                        </td>

                        {/* MRP */}
                        <td className="py-4 px-4 whitespace-nowrap text-gray-400 line-through font-mono text-xs">
                          ₹{product.mrp}
                        </td>

                        {/* Selling Price */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-extrabold text-gray-950 font-sans text-sm sm:text-base">
                              ₹{product.price}
                            </span>
                            {discountPercent > 0 && (
                              <span className="text-[11px] font-bold text-[#0D5C3A]">
                                ({discountPercent}% OFF)
                              </span>
                            )}
                          </div>
                        </td>

                        {/* QUANTITY Stepper with Minus, Centered Input, Plus */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <div className="inline-flex items-center border border-emerald-200 rounded-lg bg-white overflow-hidden shadow-2xs hover:border-[#0D5C3A]/60 focus-within:border-[#0D5C3A] focus-within:ring-1 focus-within:ring-[#0D5C3A]/20 transition-all">
                            <button
                              type="button"
                              onClick={() => decrementItem(product)}
                              disabled={currentQty <= 0}
                              className="w-8 h-8 flex items-center justify-center text-gray-700 hover:text-[#0D5C3A] hover:bg-emerald-50 disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-gray-400 transition-colors select-none font-bold text-base"
                              aria-label={`Decrease quantity of ${product.name}`}
                            >
                              <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>
                            <input
                              type="number"
                              min="0"
                              max="999"
                              value={currentQty === 0 ? '' : currentQty}
                              placeholder="0"
                              onChange={(e) => handleInputChange(product, e.target.value)}
                              className="w-12 h-8 text-center font-bold text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm font-sans [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-x border-emerald-100 bg-transparent"
                              aria-label={`Quantity of ${product.name}`}
                            />
                            <button
                              type="button"
                              onClick={() => incrementItem(product)}
                              className="w-8 h-8 flex items-center justify-center text-gray-700 hover:text-[#0D5C3A] hover:bg-emerald-50 transition-colors select-none font-bold text-base"
                              aria-label={`Increase quantity of ${product.name}`}
                            >
                              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>
                          </div>
                        </td>

                        {/* TOTAL (₹) */}
                        <td className="py-3.5 px-5 text-right whitespace-nowrap">
                          <span
                            className={`font-black font-sans text-sm sm:text-base ${
                              currentQty > 0 ? 'text-[#0D5C3A]' : 'text-gray-300'
                            }`}
                          >
                            ₹{itemTotal.toLocaleString('en-IN')}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer with Summary & Pagination Controls */}
          <div className="bg-emerald-50/60 border-t border-emerald-100 px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600 select-none">
            <p>
              Showing <strong className="text-gray-900">{totalItems > 0 ? startIndex + 1 : 0}</strong> to{' '}
              <strong className="text-gray-900">{Math.min(startIndex + itemsPerPage, totalItems)}</strong> of{' '}
              <strong className="text-gray-900">{totalItems}</strong> products
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1 rounded border border-emerald-200 bg-white text-gray-700 hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))
                .map(num => (
                  <button
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    className={`w-7 h-7 rounded text-xs font-bold transition-colors ${
                      currentPage === num
                        ? 'bg-[#0D5C3A] text-white shadow-2xs'
                        : 'border border-emerald-200 bg-white text-gray-700 hover:bg-emerald-50'
                    }`}
                  >
                    {num}
                  </button>
                ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1 rounded border border-emerald-200 bg-white text-gray-700 hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;

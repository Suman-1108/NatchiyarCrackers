import React, { useState, useMemo } from 'react';
import {
  Search,
  Minus,
  Plus,
  ArrowUpDown,
  Sparkles
} from 'lucide-react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';

const PopularProductsTable = () => {
  const {
    cartItems,
    setItemQuantity,
    incrementItem,
    decrementItem,
    clearCart,
    totalItemsCount,
    subtotal,
    totalMrp,
    totalSavings,
    minOrderAmount
  } = useCart();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('no'); // 'no', 'name', 'price', 'mrp'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Category filter tabs matching exact price list 2026
  const categoryTabs = [
    { name: 'All Categories (99)', slug: 'all' },
    { name: 'Sparklers (19)', slug: 'sparklers' },
    { name: 'Chorsa & Kurvi (6)', slug: 'chorsa-kurvi' },
    { name: 'Twinkling & Pencils (4)', slug: 'twinkling-pencils' },
    { name: 'Bijli & Sound (8)', slug: 'bijli-sound' },
    { name: 'Bombs & Rockets (7)', slug: 'bombs-rockets' },
    { name: 'Flower Pots & Tins (4)', slug: 'flower-pots' },
    { name: 'Single Sound & Walas (11)', slug: 'single-sound' },
    { name: 'Shots & Set Outs (13)', slug: 'shots-set-outs' },
    { name: 'Fancy & Kids (14)', slug: 'fancy-kids' },
    { name: 'Bank & New Items (8)', slug: 'bank-new-items' },
    { name: 'Gift Boxes (5)', slug: 'gift-boxes' },
  ];

  // Filtering and sorting logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        (p.packSize && p.packSize.toLowerCase().includes(q))
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
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getProductQuantity = (productId) => {
    const found = cartItems.find(item => item.id === productId);
    return found ? found.quantity : 0;
  };

  const handleDecrement = (product) => {
    decrementItem(product);
  };

  const handleIncrement = (product) => {
    incrementItem(product);
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
    <section className="pt-12 sm:pt-16 pb-8 sm:pb-10 w-full max-w-[1760px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 font-sans">
      {/* Top Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div>
          <span className="text-[11px] sm:text-xs font-extrabold tracking-[0.25em] text-[#CA8A04] uppercase block mb-1.5">
            VERIFIED SIVAKASI INVENTORY
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#0D5C3A] tracking-tight">
            Discover Our Popular Products
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 max-w-2xl leading-relaxed">
            Explore our wholesale and retail fireworks catalog in an organized table format with instant search, category filters, and live sorting.
          </p>
        </div>

        {/* Search Input & Item Counter Badge */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search table by name or category..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-[#E5DAC6] bg-white focus:outline-none focus:border-[#0D5C3A] shadow-2xs"
            />
          </div>

          <span className="bg-[#FAF6F0] border border-[#EAE3D6] text-gray-700 text-xs font-bold px-3 py-2 rounded-lg text-center whitespace-nowrap shadow-2xs">
            Showing <strong className="text-[#0D5C3A]">{displayedProducts.length}</strong> items
          </span>
        </div>
      </div>

      {/* Category Filter Pills Bar */}
      <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar pb-3 mb-6 select-none">
        {categoryTabs.map((tab) => {
          const isActive = selectedCategory === tab.slug;
          return (
            <button
              key={tab.slug}
              onClick={() => {
                setSelectedCategory(tab.slug);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border shrink-0 ${
                isActive
                  ? 'bg-[#0D5C3A] text-white border-[#0D5C3A] shadow-xs'
                  : 'bg-white hover:bg-emerald-50 text-gray-700 border-gray-200 hover:border-[#0D5C3A]/40'
              }`}
            >
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Table Container (IMAGE-FREE as requested: No Product Image Column) */}
      <div className="bg-white rounded-2xl border border-[#EAE3D6] shadow-sm overflow-hidden">
        {/* Desktop Table View (hidden on mobile) */}
        <div className="hidden md:block overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            {/* Table Header Row */}
            <thead>
              <tr className="bg-[#FAF6F0] border-b border-[#EAE3D6] text-gray-800 text-[11px] sm:text-xs font-extrabold uppercase tracking-wider select-none">
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
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    <Sparkles className="w-8 h-8 text-yellow-500 mx-auto mb-2 opacity-50" />
                    <p className="font-bold text-gray-800">No products found matching your search</p>
                    <p className="text-xs text-gray-500 mt-1">Try searching for a different keyword or category</p>
                  </td>
                </tr>
              ) : (
                displayedProducts.map((product, idx) => {
                  const discountPercent = product.mrp > product.price
                    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
                    : 0;
                  const currentQty = getProductQuantity(product.id);
                  const itemTotal = currentQty * product.price;

                  return (
                    <tr
                      key={product.id}
                      className={`hover:bg-[#FAF8F5] transition-colors group ${
                        currentQty > 0 ? 'bg-[#FFFDF9]' : ''
                      }`}
                    >
                      {/* S.No */}
                      <td className="py-4 px-4 font-bold text-gray-700 font-mono">
                        {startIndex + idx + 1}
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
                          <span className="text-yellow-600 text-[11px] font-semibold flex items-center gap-1">
                            <span>★</span>
                            <span>Festive Choice</span>
                          </span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="text-[#CA8A04] font-bold text-xs uppercase tracking-wider">
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

                      {/* QUANTITY Stepper with Minus, Centered Input, Plus matching reference image */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="inline-flex items-center border border-[#CFD8DC] rounded-lg bg-white overflow-hidden shadow-2xs hover:border-[#0D5C3A]/50 focus-within:border-[#0D5C3A] focus-within:ring-1 focus-within:ring-[#0D5C3A]/20 transition-all">
                          <button
                            type="button"
                            onClick={() => handleDecrement(product)}
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
                            className="w-12 h-8 text-center font-bold text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm font-sans [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-x border-[#EAE3D6] bg-transparent"
                            aria-label={`Quantity of ${product.name}`}
                          />
                          <button
                            type="button"
                            onClick={() => handleIncrement(product)}
                            className="w-8 h-8 flex items-center justify-center text-gray-700 hover:text-[#0D5C3A] hover:bg-emerald-50 transition-colors select-none font-bold text-base"
                            aria-label={`Increase quantity of ${product.name}`}
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                        </div>
                      </td>

                      {/* TOTAL (₹) matching reference screenshot */}
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

        {/* Mobile Product Card List View (block md:hidden) */}
        <div className="block md:hidden divide-y divide-[#EAE3D6]/70">
          {displayedProducts.length === 0 ? (
            <div className="py-12 text-center text-gray-500 px-4">
              <Sparkles className="w-8 h-8 text-yellow-500 mx-auto mb-2 opacity-50" />
              <p className="font-bold text-gray-800">No products found matching your search</p>
              <p className="text-xs text-gray-500 mt-1">Try searching for a different keyword or category</p>
            </div>
          ) : (
            displayedProducts.map((product, idx) => {
              const discountPercent = product.mrp > product.price
                ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
                : 0;
              const currentQty = getProductQuantity(product.id);
              const itemTotal = currentQty * product.price;

              return (
                <div
                  key={product.id}
                  className={`p-3.5 sm:p-4 transition-colors ${
                    currentQty > 0 ? 'bg-[#FFFDF9]' : 'bg-white'
                  }`}
                >
                  {/* Top: Serial No, Category, Pack Size */}
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-[#FAF6F0] border border-[#EAE3D6] text-gray-700 font-mono font-bold text-[11px] flex items-center justify-center shrink-0">
                        {startIndex + idx + 1}
                      </span>
                      <span className="text-[#CA8A04] font-extrabold text-[10px] uppercase tracking-wider">
                        {product.categoryName?.toUpperCase() || 'FIREWORKS'}
                      </span>
                    </div>
                    <span className="text-gray-600 font-mono text-[11px] font-medium bg-[#FAF6F0] px-2 py-0.5 rounded border border-[#EAE3D6]">
                      {product.packSize || '1 Unit'}
                    </span>
                  </div>

                  {/* Middle: Product Name & Badges */}
                  <div className="mb-2.5">
                    <h3 className="font-serif font-bold text-gray-900 text-sm leading-snug">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                        IN STOCK
                      </span>
                      <span className="text-yellow-600 text-[10px] font-semibold flex items-center gap-0.5">
                        <span>★</span>
                        <span>Festive Choice</span>
                      </span>
                    </div>
                  </div>

                  {/* Pricing and Stepper Row */}
                  <div className="flex items-center justify-between gap-3 pt-2 border-t border-gray-100">
                    {/* Price details */}
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-black text-gray-950 font-sans text-base">
                          ₹{product.price}
                        </span>
                        <span className="text-xs text-gray-400 line-through font-mono">
                          ₹{product.mrp}
                        </span>
                      </div>
                      {discountPercent > 0 && (
                        <span className="text-[10px] font-bold text-[#0D5C3A] block">
                          {discountPercent}% OFF
                        </span>
                      )}
                    </div>

                    {/* Quantity Stepper & Item Total */}
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <div className="inline-flex items-center border border-[#CFD8DC] rounded-lg bg-white overflow-hidden shadow-2xs">
                        <button
                          type="button"
                          onClick={() => handleDecrement(product)}
                          disabled={currentQty <= 0}
                          className="w-8 h-8 flex items-center justify-center text-gray-700 hover:text-[#0D5C3A] hover:bg-emerald-50 disabled:opacity-25 transition-colors select-none font-bold"
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
                          className="w-10 h-8 text-center font-bold text-gray-900 placeholder:text-gray-400 focus:outline-none text-xs font-sans [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-x border-[#EAE3D6] bg-transparent"
                          aria-label={`Quantity of ${product.name}`}
                        />
                        <button
                          type="button"
                          onClick={() => handleIncrement(product)}
                          className="w-8 h-8 flex items-center justify-center text-gray-700 hover:text-[#0D5C3A] hover:bg-emerald-50 transition-colors select-none font-bold"
                          aria-label={`Increase quantity of ${product.name}`}
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                      </div>

                      <div className="text-right min-w-[56px]">
                        <span className="text-[9px] text-gray-400 block font-medium uppercase leading-tight">Total</span>
                        <span className={`font-black font-sans text-xs ${currentQty > 0 ? 'text-[#0D5C3A]' : 'text-gray-300'}`}>
                          ₹{itemTotal.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Table Footer with Summary & Pagination Controls */}
        <div className="bg-[#FAF6F0] border-t border-[#EAE3D6] px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600 select-none">
          <p>
            Showing <strong className="text-gray-900">{totalItems > 0 ? startIndex + 1 : 0}</strong> to{' '}
            <strong className="text-gray-900">{Math.min(startIndex + itemsPerPage, totalItems)}</strong> of{' '}
            <strong className="text-gray-900">{totalItems}</strong> products
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded border border-[#E5DAC6] bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(Math.max(0, currentPage - 2), Math.min(totalPages, currentPage + 1))
              .map(num => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`w-7 h-7 rounded text-xs font-bold transition-colors ${
                    currentPage === num
                      ? 'bg-[#0D5C3A] text-white shadow-2xs'
                      : 'border border-[#E5DAC6] bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {num}
                </button>
              ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 rounded border border-[#E5DAC6] bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularProductsTable;

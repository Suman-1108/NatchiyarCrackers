import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import adminApi from '../../services/adminApi';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  PhoneCall,
  Settings,
  LogOut,
  ExternalLink,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  Printer,
  RefreshCw,
  Phone,
  MessageCircle,
  DollarSign,
  AlertTriangle,
  Menu,
  X,
  Sparkles,
  Save,
  Check
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  // Navigation tab: 'overview' | 'products' | 'orders' | 'enquiries' | 'settings'
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Data states
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [wholesaleLeads, setWholesaleLeads] = useState([]);
  const [settings, setSettings] = useState({
    primaryPhone: '9994100905',
    secondaryPhone: '9442701264',
    tertiaryPhone: '9363779531',
    whatsappNumber: '919994100905',
    minOrderAmount: 3000,
    badgeText: 'Wholesale & Retail Orders',
    tamilTagline: 'சிவகாசி கம்பெனியின் நேரடி விற்பனை',
    announcement: '100% Legal PESO Green Crackers & Fresh 2026 Stock • Pan-India Fast Transport Delivery'
  });

  // Filter & Search states
  const [productSearch, setProductSearch] = useState('');
  const [selectedProductCategory, setSelectedProductCategory] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');

  // Modal states
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  // Product Form State
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'sparklers',
    categoryName: 'Sparklers',
    packSize: '1 Box',
    mrp: '',
    price: '',
    availability: 'In Stock',
    stock: 100,
    featured: false,
    tag: '',
    description: ''
  });

  // Load all admin data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, prodRes, catRes, ordRes, enqRes, whoRes, setRes] = await Promise.allSettled([
        adminApi.getStats(),
        adminApi.getProducts(),
        adminApi.getCategories(),
        adminApi.getOrders(),
        adminApi.getEnquiries(),
        adminApi.getWholesaleEnquiries(),
        adminApi.getSettings()
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value.success) {
        setStats(statsRes.value.stats);
      }
      if (prodRes.status === 'fulfilled' && prodRes.value.data) {
        setProducts(prodRes.value.data);
      }
      if (catRes.status === 'fulfilled' && catRes.value.data) {
        setCategories(catRes.value.data);
      }
      if (ordRes.status === 'fulfilled' && ordRes.value.data) {
        setOrders(ordRes.value.data);
      }
      if (enqRes.status === 'fulfilled' && enqRes.value.data) {
        setEnquiries(enqRes.value.data);
      }
      if (whoRes.status === 'fulfilled' && whoRes.value.data) {
        setWholesaleLeads(whoRes.value.data);
      }
      if (setRes.status === 'fulfilled' && setRes.value.settings) {
        setSettings(setRes.value.settings);
      }
    } catch (err) {
      toast.error('Failed to load some admin data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out from admin console');
    navigate('/portal/admin/login');
  };

  // --- Product Handlers ---
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'sparklers',
      categoryName: 'Sparklers',
      packSize: '1 Box (10 Pcs)',
      mrp: '',
      price: '',
      availability: 'In Stock',
      stock: 100,
      featured: false,
      tag: 'Festive Choice',
      description: ''
    });
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name || '',
      category: prod.category || 'sparklers',
      categoryName: prod.categoryName || 'Sparklers',
      packSize: prod.packSize || '1 Box',
      mrp: prod.mrp || '',
      price: prod.price || '',
      availability: prod.availability || 'In Stock',
      stock: prod.stock !== undefined ? prod.stock : 100,
      featured: Boolean(prod.featured),
      tag: prod.tag || '',
      description: prod.description || ''
    });
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.mrp || !productForm.price) {
      toast.error('Name, MRP, and Selling Price are required.');
      return;
    }

    setSavingProduct(true);
    try {
      if (editingProduct) {
        const res = await adminApi.updateProduct(editingProduct.id || editingProduct._id, productForm);
        if (res.success) {
          toast.success('Product updated successfully!');
          setProducts(prev => prev.map(p => (p.id === editingProduct.id || p._id === editingProduct._id ? { ...p, ...productForm } : p)));
          setProductModalOpen(false);
        }
      } else {
        const res = await adminApi.createProduct(productForm);
        if (res.success) {
          toast.success('New product created!');
          setProducts(prev => [res.data, ...prev]);
          setProductModalOpen(false);
        }
      }
    } catch (err) {
      toast.error('Error saving product: ' + (err.response?.data?.message || err.message));
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (prod) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${prod.name}"?`)) return;

    try {
      const res = await adminApi.deleteProduct(prod.id || prod._id);
      if (res.success) {
        toast.success(`"${prod.name}" removed.`);
        setProducts(prev => prev.filter(p => p.id !== prod.id && p._id !== prod._id));
      }
    } catch (err) {
      toast.error('Failed to delete product: ' + err.message);
    }
  };

  const handleToggleStock = async (prod) => {
    const newStatus = prod.availability === 'In Stock' ? 'Out of Stock' : 'In Stock';
    try {
      await adminApi.updateProduct(prod.id || prod._id, { availability: newStatus });
      setProducts(prev => prev.map(p => (p.id === prod.id || p._id === prod._id ? { ...p, availability: newStatus } : p)));
      toast.success(`${prod.name} marked as ${newStatus}`);
    } catch (err) {
      toast.error('Failed to toggle stock status');
    }
  };

  // --- Order Handlers ---
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await adminApi.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        toast.success(`Order marked as ${newStatus}`);
        setOrders(prev => prev.map(o => (o.orderRef === orderId || o._id === orderId ? { ...o, status: newStatus } : o)));
        if (selectedOrder) {
          setSelectedOrder(prev => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      toast.error('Failed to update order status');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm(`Delete order ${orderId} permanently?`)) return;
    try {
      const res = await adminApi.deleteOrder(orderId);
      if (res.success) {
        toast.success('Order deleted');
        setOrders(prev => prev.filter(o => o.orderRef !== orderId && o._id !== orderId));
        if (selectedOrder?.orderRef === orderId) setSelectedOrder(null);
      }
    } catch (err) {
      toast.error('Failed to delete order');
    }
  };

  // --- Enquiry Handlers ---
  const handleDeleteEnquiry = async (id, isWholesale = false) => {
    if (!window.confirm('Delete this lead record?')) return;
    try {
      if (isWholesale) {
        await adminApi.deleteWholesaleEnquiry(id);
        setWholesaleLeads(prev => prev.filter(w => w.quoteRef !== id && w._id !== id));
      } else {
        await adminApi.deleteEnquiry(id);
        setEnquiries(prev => prev.filter(e => e.id !== id && e._id !== id));
      }
      toast.success('Lead deleted');
    } catch (err) {
      toast.error('Error deleting lead');
    }
  };

  // --- Save Settings Handler ---
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await adminApi.updateSettings(settings);
      if (res.success) {
        toast.success('Store settings saved successfully!');
      }
    } catch (err) {
      toast.error('Failed to save settings: ' + err.message);
    } finally {
      setSavingSettings(false);
    }
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = !productSearch ||
        p.name?.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.categoryName?.toLowerCase().includes(productSearch.toLowerCase()) ||
        String(p.no)?.includes(productSearch);
      const matchesCat = selectedProductCategory === 'all' || p.category === selectedProductCategory;
      return matchesSearch && matchesCat;
    });
  }, [products, productSearch, selectedProductCategory]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch = !orderSearch ||
        o.orderRef?.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customer?.fullName?.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customer?.phone?.includes(orderSearch) ||
        o.customer?.district?.toLowerCase().includes(orderSearch.toLowerCase());
      const matchesStatus = orderStatusFilter === 'ALL' || o.status === orderStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  // Status badge styling helper
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'DELIVERED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300"><CheckCircle className="w-3 h-3" /> Delivered</span>;
      case 'DISPATCHED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-blue-100 text-blue-800 border border-blue-300"><Truck className="w-3 h-3" /> Dispatched</span>;
      case 'CONFIRMED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-purple-100 text-purple-800 border border-purple-300"><Check className="w-3 h-3" /> Confirmed</span>;
      case 'CANCELLED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-red-100 text-red-800 border border-red-300"><XCircle className="w-3 h-3" /> Cancelled</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300"><Clock className="w-3 h-3" /> Awaiting Confirmation</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F5] flex flex-col lg:flex-row font-sans text-gray-900">
      {/* 1. Mobile Header with Hamburger Toggle */}
      <div className="lg:hidden bg-[#062D1B] text-white px-4 py-3 flex items-center justify-between border-b border-emerald-900 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2.5">
          <img src="/assets/natchiyar_square_logo.png" alt="Emblem" className="w-8 h-8 object-contain" />
          <div>
            <h2 className="font-serif font-black text-sm text-white leading-none">SRI NATCHIYAR</h2>
            <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">Admin Console</span>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-white/10 text-white"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* 2. Admin Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#062D1B] text-white flex flex-col justify-between p-5 border-r border-[#0A3D25] z-50 transition-transform duration-200 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="flex items-center gap-3 pb-6 border-b border-emerald-800/60 mb-6">
            <div className="w-11 h-11 rounded-xl bg-white/10 border border-emerald-400/30 p-1.5 shrink-0 flex items-center justify-center">
              <img src="/assets/natchiyar_square_logo.png" alt="Emblem" className="w-full h-full object-contain" />
            </div>
            <div className="leading-tight">
              <h1 className="font-serif font-black text-base tracking-wide text-white">SRI NATCHIYAR</h1>
              <p className="text-[10px] font-extrabold tracking-widest text-emerald-300 uppercase">Management Portal</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            {[
              { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
              { id: 'products', label: 'Products Catalog', icon: Package, count: products.length },
              { id: 'orders', label: 'Orders & Dispatches', icon: ShoppingCart, count: orders.length },
              { id: 'enquiries', label: 'Enquiries & Leads', icon: PhoneCall, count: enquiries.length + wholesaleLeads.length },
              { id: 'settings', label: 'Store Settings', icon: Settings }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#25D366] text-white shadow-md'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                      isActive ? 'bg-black/30 text-white' : 'bg-white/15 text-emerald-200'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Storefront Link & Admin Logout */}
        <div className="pt-6 border-t border-emerald-800/60 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-emerald-200 transition-colors"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Live Storefront</span>
            </div>
            <span className="text-[10px] text-yellow-300">Open ↗</span>
          </a>

          <div className="p-3 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between">
            <div className="leading-none">
              <span className="text-[10px] text-gray-400 block mb-1">Logged In As</span>
              <span className="text-xs font-bold text-white uppercase">{admin?.username || 'Admin'}</span>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* 3. Main Dashboard Workspace */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full overflow-y-auto">
        {/* Top Header Row with Refresh */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#0D5C3A] tracking-tight capitalize">
              {activeTab === 'overview' && 'Operations Dashboard'}
              {activeTab === 'products' && 'Fireworks Inventory Management'}
              {activeTab === 'orders' && 'Customer Orders & Booking Console'}
              {activeTab === 'enquiries' && 'Customer Inquiries & Wholesale Leads'}
              {activeTab === 'settings' && 'Global Store Configuration'}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Sri Natchiyar Crackers • Live Sivakasi Factory Gate Administration
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={loadDashboardData}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 shadow-2xs transition-all active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#0D5C3A]' : ''}`} />
              <span>Refresh Data</span>
            </button>

            {activeTab === 'products' && (
              <button
                onClick={handleOpenAddProduct}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-black shadow-md transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Firework</span>
              </button>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* TAB 1: OVERVIEW & ANALYTICS                                   */}
        {/* ============================================================ */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Orders Card */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider block mb-1">
                    Total Bookings
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-[#0D5C3A]">
                    {orders.length}
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-600 mt-1 inline-block">
                    {orders.filter(o => o.status === 'CONFIRMED' || o.status === 'DELIVERED').length} Confirmed / Dispatched
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#0D5C3A] flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6" />
                </div>
              </div>

              {/* Total Revenue Card */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider block mb-1">
                    Order Value Pipeline
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-[#0D5C3A]">
                    ₹{orders.reduce((sum, o) => sum + (o.total || 0), 0).toLocaleString('en-IN')}
                  </div>
                  <span className="text-[11px] font-semibold text-gray-500 mt-1 inline-block">
                    {orders.length} total parcel submissions
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>

              {/* Inventory Health Card */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider block mb-1">
                    Active Catalog
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-[#0D5C3A]">
                    {products.length}
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 mt-1 inline-block">
                    {products.filter(p => p.availability === 'In Stock').length} In Stock
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#0D5C3A] flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
              </div>

              {/* Leads & Enquiries Card */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider block mb-1">
                    Customer Leads
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-[#0D5C3A]">
                    {enquiries.length + wholesaleLeads.length}
                  </div>
                  <span className="text-[11px] font-semibold text-purple-700 mt-1 inline-block">
                    {wholesaleLeads.length} Wholesale B2B Leads
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <PhoneCall className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Recent Orders Section */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-black text-lg text-gray-900">Recent Transport Bookings</h3>
                  <p className="text-xs text-gray-500">Live parcel orders submitted from checkout</p>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-[#0D5C3A] hover:underline"
                >
                  View All Orders →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#FAF8F5] border-b border-gray-200 text-gray-600 font-extrabold uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-4">Order Ref</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">District</th>
                      <th className="py-3 px-4">Total Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-400">
                          No orders registered yet. New orders placed by customers will appear here automatically.
                        </td>
                      </tr>
                    ) : (
                      orders.slice(0, 6).map((order) => (
                        <tr key={order.orderRef} className="hover:bg-emerald-50/40 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-gray-900">{order.orderRef}</td>
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-gray-900 block">{order.customer?.fullName}</span>
                            <span className="text-[11px] text-gray-500">{order.customer?.phone}</span>
                          </td>
                          <td className="py-3.5 px-4 font-medium text-gray-700">{order.customer?.district || 'Tamil Nadu'}</td>
                          <td className="py-3.5 px-4 font-bold text-gray-900 font-mono">₹{order.total?.toLocaleString('en-IN')}</td>
                          <td className="py-3.5 px-4">{renderStatusBadge(order.status)}</td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 text-[#0D5C3A] hover:bg-emerald-100 font-bold text-[11px] transition-colors"
                            >
                              Inspect Order
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: PRODUCTS INVENTORY MANAGEMENT                          */}
        {/* ============================================================ */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search products by name or S.No..."
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#0D5C3A]"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <select
                  value={selectedProductCategory}
                  onChange={(e) => setSelectedProductCategory(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-gray-300 bg-white text-gray-700 font-bold focus:outline-none focus:border-[#0D5C3A]"
                >
                  <option value="all">All Categories ({products.length})</option>
                  <option value="sparklers">Sparklers</option>
                  <option value="flower-pots">Flower Pots</option>
                  <option value="chorsa-kurvi">Chakkars & Kurvi</option>
                  <option value="twinkling-pencils">Twinkling & Pencils</option>
                  <option value="bijli-sound">Bijli & Sound</option>
                  <option value="bombs-rockets">Bombs & Rockets</option>
                  <option value="single-sound">Single Sound & Walas</option>
                  <option value="shots-set-outs">Shots & Set Outs</option>
                  <option value="fancy-kids">Kids & Fancy</option>
                  <option value="bank-new-items">Bank & New Items</option>
                  <option value="gift-boxes">Gift Boxes</option>
                </select>

                <span className="text-xs text-gray-500 font-bold whitespace-nowrap">
                  Showing <strong>{filteredProducts.length}</strong> items
                </span>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#FAF8F5] border-b border-gray-200 text-gray-700 font-extrabold uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-4">S.No</th>
                      <th className="py-3 px-4">Product Name</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Pack Size</th>
                      <th className="py-3 px-4">MRP</th>
                      <th className="py-3 px-4">Selling Price</th>
                      <th className="py-3 px-4">Discount</th>
                      <th className="py-3 px-4">Availability</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-8 text-center text-gray-400">
                          No matching fireworks found in catalog.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((p) => {
                        const inStock = p.availability === 'In Stock';
                        return (
                          <tr key={p.id || p._id} className="hover:bg-emerald-50/30 transition-colors">
                            <td className="py-3 px-4 font-mono font-bold text-gray-500">{p.no}</td>
                            <td className="py-3 px-4 font-serif font-bold text-gray-900 text-sm">
                              {p.name}
                              {p.featured && (
                                <span className="ml-2 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300">
                                  ★ Featured
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 font-bold text-[#0D5C3A]">{p.categoryName}</td>
                            <td className="py-3 px-4 text-gray-600">{p.packSize || '1 Box'}</td>
                            <td className="py-3 px-4 text-gray-400 line-through font-mono">₹{p.mrp}</td>
                            <td className="py-3 px-4 font-bold text-gray-900 font-mono text-sm">₹{p.price}</td>
                            <td className="py-3 px-4 font-bold text-emerald-700">
                              {p.discount || (p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0)}% OFF
                            </td>
                            <td className="py-3 px-4">
                              <button
                                onClick={() => handleToggleStock(p)}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-black transition-colors ${
                                  inStock
                                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                                }`}
                              >
                                {inStock ? '● In Stock' : '✕ Out of Stock'}
                              </button>
                            </td>
                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleOpenEditProduct(p)}
                                  className="p-1.5 rounded-lg text-gray-600 hover:text-[#0D5C3A] hover:bg-emerald-50 transition-colors"
                                  title="Edit Product"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p)}
                                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: ORDERS & DISPATCH MANAGEMENT                          */}
        {/* ============================================================ */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Filter & Status Tabs */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search by Order Ref, Customer Name, Phone, District..."
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#0D5C3A]"
                />
              </div>

              {/* Status Pill Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {['ALL', 'AWAITING_TRANSPORT_CONFIRMATION', 'CONFIRMED', 'DISPATCHED', 'DELIVERED', 'CANCELLED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      orderStatusFilter === st
                        ? 'bg-[#0D5C3A] text-white shadow-2xs'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {st === 'ALL' ? `All (${orders.length})` : st.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#FAF8F5] border-b border-gray-200 text-gray-700 font-extrabold uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-4">Order Ref</th>
                      <th className="py-3 px-4">Booking Date</th>
                      <th className="py-3 px-4">Customer Details</th>
                      <th className="py-3 px-4">Destination District</th>
                      <th className="py-3 px-4">Items Count</th>
                      <th className="py-3 px-4">Total Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-10 text-center text-gray-400">
                          No matching orders found.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => (
                        <tr key={ord.orderRef} className="hover:bg-emerald-50/30 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-gray-900">{ord.orderRef}</td>
                          <td className="py-3 px-4 text-gray-500 text-[11px]">
                            {new Date(ord.createdAt || Date.now()).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-gray-900 block">{ord.customer?.fullName}</span>
                            <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mt-0.5">
                              <Phone className="w-3 h-3 text-[#0D5C3A]" />
                              <span>{ord.customer?.phone}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-medium text-gray-700">{ord.customer?.district || 'Tamil Nadu'}</td>
                          <td className="py-3 px-4 font-bold text-gray-700">{ord.items?.length || 0} varieties</td>
                          <td className="py-3 px-4 font-mono font-black text-gray-900 text-sm">
                            ₹{ord.total?.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-4">{renderStatusBadge(ord.status)}</td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedOrder(ord)}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-[#0D5C3A] hover:bg-emerald-100 font-bold text-xs flex items-center gap-1"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Inspect</span>
                              </button>
                              <button
                                onClick={() => handleDeleteOrder(ord.orderRef)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"
                                title="Delete Order"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: ENQUIRIES & WHOLESALE LEADS                           */}
        {/* ============================================================ */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6">
            {/* Wholesale B2B Inquiries */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-black text-lg text-[#0D5C3A]">
                    Wholesale B2B Agency Enquiries ({wholesaleLeads.length})
                  </h3>
                  <p className="text-xs text-gray-500">Retail shop owners and bulk booking inquiries</p>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {wholesaleLeads.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-xs">No wholesale inquiries submitted yet.</div>
                ) : (
                  wholesaleLeads.map((w) => (
                    <div key={w.quoteRef || w._id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-emerald-50/20 transition-colors">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono font-bold text-xs bg-emerald-100 text-[#0D5C3A] px-2 py-0.5 rounded">
                            {w.quoteRef}
                          </span>
                          <h4 className="font-bold text-gray-900 text-sm">{w.businessName}</h4>
                          <span className="text-xs text-gray-500">({w.contactPerson})</span>
                        </div>
                        <p className="text-xs text-gray-600">
                          <strong>Location:</strong> {w.location}, {w.state} • <strong>Estimated Budget:</strong> {w.estimatedBudget}
                        </p>
                        {w.requirements && (
                          <p className="text-xs text-gray-500 mt-1 italic">
                            "{w.requirements}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={`tel:${w.phone}`}
                          className="px-3 py-1.5 rounded-lg bg-[#0D5C3A] text-white text-xs font-bold flex items-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call {w.phone}</span>
                        </a>
                        <a
                          href={`https://wa.me/91${w.phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(w.contactPerson)}%2C%20regarding%20your%20Wholesale%20Fireworks%20enquiry%20with%20Sri%20Natchiyar%20Crackers`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-[#25D366] text-white text-xs font-bold flex items-center gap-1.5"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                        <button
                          onClick={() => handleDeleteEnquiry(w.quoteRef || w._id, true)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* General Retail Inquiries */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-serif font-black text-lg text-gray-900">
                  General Customer Messages ({enquiries.length})
                </h3>
                <p className="text-xs text-gray-500">Submitted through contact page or chat desk</p>
              </div>

              <div className="divide-y divide-gray-100">
                {enquiries.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-xs">No customer contact messages yet.</div>
                ) : (
                  enquiries.map((e) => (
                    <div key={e.id || e._id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/50">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-gray-900 text-sm">{e.name}</h4>
                          <span className="text-xs text-gray-500">• {e.phone}</span>
                          {e.email && <span className="text-xs text-gray-400">({e.email})</span>}
                        </div>
                        <p className="text-xs text-gray-700 mt-1">{e.message || 'No additional message.'}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={`tel:${e.phone}`}
                          className="px-3 py-1.5 rounded-lg bg-[#0D5C3A] text-white text-xs font-bold flex items-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call</span>
                        </a>
                        <button
                          onClick={() => handleDeleteEnquiry(e.id || e._id, false)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 5: STORE SETTINGS MANAGEMENT                              */}
        {/* ============================================================ */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs max-w-4xl space-y-6">
            <div>
              <h2 className="text-lg font-serif font-black text-[#0D5C3A]">Direct Sivakasi Hotlines & WhatsApp</h2>
              <p className="text-xs text-gray-500">Update phone numbers displayed across the navbar, footer, and WhatsApp floating actions</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Primary Hotline Phone</label>
                <input
                  type="text"
                  value={settings.primaryPhone}
                  onChange={(e) => setSettings({ ...settings, primaryPhone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#0D5C3A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Secondary Hotline</label>
                <input
                  type="text"
                  value={settings.secondaryPhone}
                  onChange={(e) => setSettings({ ...settings, secondaryPhone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#0D5C3A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Tertiary Hotline</label>
                <input
                  type="text"
                  value={settings.tertiaryPhone}
                  onChange={(e) => setSettings({ ...settings, tertiaryPhone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#0D5C3A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Primary WhatsApp Desk Number (With Country Code)</label>
                <input
                  type="text"
                  value={settings.whatsappNumber}
                  onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#0D5C3A] focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <h2 className="text-lg font-serif font-black text-[#0D5C3A]">Checkout & Transport Threshold</h2>
              <p className="text-xs text-gray-500 mb-4">Control minimum cart order requirement for Sivakasi parcel dispatch</p>
              
              <div className="w-full sm:w-1/2">
                <label className="block text-xs font-bold text-gray-700 mb-1">Minimum Order Amount (₹)</label>
                <input
                  type="number"
                  value={settings.minOrderAmount}
                  onChange={(e) => setSettings({ ...settings, minOrderAmount: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-mono font-bold focus:border-[#0D5C3A] focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <h2 className="text-lg font-serif font-black text-[#0D5C3A]">Header Announcement Ticker</h2>
              <p className="text-xs text-gray-500 mb-4">Text scrolling on top of every customer page</p>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Badge Headline</label>
                  <input
                    type="text"
                    value={settings.badgeText}
                    onChange={(e) => setSettings({ ...settings, badgeText: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#0D5C3A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Announcement Details</label>
                  <input
                    type="text"
                    value={settings.announcement}
                    onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#0D5C3A] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={savingSettings}
                className="px-6 py-3 rounded-xl bg-[#0D5C3A] hover:bg-[#073822] text-white font-bold text-sm flex items-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{savingSettings ? 'Saving Settings...' : 'Save Configuration Changes'}</span>
              </button>
            </div>
          </form>
        )}
      </main>

      {/* ============================================================ */}
      {/* MODAL 1: ADD / EDIT PRODUCT DIALOG                           */}
      {/* ============================================================ */}
      {productModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 relative my-8">
            <button
              onClick={() => setProductModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-serif font-black text-[#0D5C3A] mb-1">
              {editingProduct ? 'Edit Fireworks Item' : 'Add New Fireworks Item'}
            </h2>
            <p className="text-xs text-gray-500 mb-6">
              Fill in product name, pricing, pack size and stock status for the catalog
            </p>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Firework Name *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. 10 CM Electric Sparklers"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#0D5C3A] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => {
                      const sel = e.target.value;
                      const catObj = {
                        'sparklers': 'Sparklers',
                        'flower-pots': 'Flower Pots',
                        'chorsa-kurvi': 'Chorsa & Kurvi',
                        'twinkling-pencils': 'Twinkling & Pencils',
                        'bijli-sound': 'Bijli & Sound',
                        'bombs-rockets': 'Bombs & Rockets',
                        'single-sound': 'Single Sound & Walas',
                        'shots-set-outs': 'Shots & Set Outs',
                        'fancy-kids': 'Kids & Fancy',
                        'bank-new-items': 'Bank & New Items',
                        'gift-boxes': 'Gift Boxes'
                      };
                      setProductForm({
                        ...productForm,
                        category: sel,
                        categoryName: catObj[sel] || 'Fireworks'
                      });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#0D5C3A] focus:outline-none"
                  >
                    <option value="sparklers">Sparklers</option>
                    <option value="flower-pots">Flower Pots & Tins</option>
                    <option value="chorsa-kurvi">Chakkars & Kurvi</option>
                    <option value="twinkling-pencils">Twinkling & Pencils</option>
                    <option value="bijli-sound">Bijli & Sound</option>
                    <option value="bombs-rockets">Bombs & Rockets</option>
                    <option value="single-sound">Single Sound & Walas</option>
                    <option value="shots-set-outs">Shots & Set Outs</option>
                    <option value="fancy-kids">Kids & Fancy</option>
                    <option value="bank-new-items">Bank & New Items</option>
                    <option value="gift-boxes">Gift Boxes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Pack Size / Units *</label>
                  <input
                    type="text"
                    required
                    value={productForm.packSize}
                    onChange={(e) => setProductForm({ ...productForm, packSize: e.target.value })}
                    placeholder="e.g. 1 Box (10 Pcs) or 1 Box (5 Pcs)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#0D5C3A] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Original MRP (₹) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.mrp}
                    onChange={(e) => setProductForm({ ...productForm, mrp: e.target.value })}
                    placeholder="e.g. 50"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-mono focus:border-[#0D5C3A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Wholesale Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="e.g. 10"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-mono font-bold focus:border-[#0D5C3A] focus:outline-none"
                  />
                </div>
              </div>

              {/* Calculated Discount Pill */}
              {productForm.mrp && productForm.price && Number(productForm.mrp) > Number(productForm.price) && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center justify-between">
                  <span>Calculated Discount:</span>
                  <span className="font-mono text-sm">{Math.round(((Number(productForm.mrp) - Number(productForm.price)) / Number(productForm.mrp)) * 100)}% OFF</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Availability Status</label>
                  <select
                    value={productForm.availability}
                    onChange={(e) => setProductForm({ ...productForm, availability: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#0D5C3A] focus:outline-none"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.featured}
                      onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                      className="w-4 h-4 text-[#0D5C3A] rounded border-gray-300 focus:ring-[#0D5C3A]"
                    />
                    <span className="text-xs font-bold text-gray-800">Festive Choice / Featured</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProduct}
                  className="px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-black shadow-md disabled:opacity-60"
                >
                  {savingProduct ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Firework Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: INSPECT ORDER & PACKING SLIP DETAILS                */}
      {/* ============================================================ */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 relative my-8">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-200 mb-6">
              <div>
                <span className="text-xs font-mono font-bold text-gray-500">BOOKING REFERENCE</span>
                <h2 className="text-2xl font-serif font-black text-[#0D5C3A]">{selectedOrder.orderRef}</h2>
                <span className="text-[11px] text-gray-500">
                  {new Date(selectedOrder.createdAt || Date.now()).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-xs font-bold text-gray-700 flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>
              </div>
            </div>

            {/* Customer Details Grid */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 mb-6 text-xs space-y-2">
              <h4 className="font-bold text-gray-900 uppercase text-[11px] tracking-wider mb-2">Customer & Delivery Info</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700">
                <p><strong>Name:</strong> {selectedOrder.customer?.fullName}</p>
                <p><strong>Phone:</strong> {selectedOrder.customer?.phone}</p>
                {selectedOrder.customer?.email && <p><strong>Email:</strong> {selectedOrder.customer?.email}</p>}
                <p><strong>District:</strong> {selectedOrder.customer?.district}, {selectedOrder.customer?.state}</p>
                <p className="sm:col-span-2"><strong>Address:</strong> {selectedOrder.customer?.address} {selectedOrder.customer?.pincode ? `• PIN: ${selectedOrder.customer.pincode}` : ''}</p>
                {selectedOrder.customer?.preferredTransport && (
                  <p className="sm:col-span-2 text-[#0D5C3A] font-semibold">
                    <strong>Preferred Transport Parcel Hub:</strong> {selectedOrder.customer.preferredTransport}
                  </p>
                )}
                {selectedOrder.customer?.notes && (
                  <p className="sm:col-span-2 italic text-gray-600">
                    <strong>Customer Note:</strong> "{selectedOrder.customer.notes}"
                  </p>
                )}
              </div>
            </div>

            {/* Itemized Table */}
            <div className="mb-6">
              <h4 className="font-bold text-gray-900 uppercase text-[11px] tracking-wider mb-2">Booked Fireworks ({selectedOrder.items?.length || 0})</h4>
              <div className="border border-gray-200 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#FAF8F5] text-gray-600 border-b border-gray-200 font-bold">
                    <tr>
                      <th className="py-2 px-3">Item</th>
                      <th className="py-2 px-3">Pack</th>
                      <th className="py-2 px-3">Rate</th>
                      <th className="py-2 px-3">Qty</th>
                      <th className="py-2 px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedOrder.items?.map((it, idx) => (
                      <tr key={idx}>
                        <td className="py-2 px-3 font-medium text-gray-900">{it.name}</td>
                        <td className="py-2 px-3 text-gray-500 text-[11px]">{it.packSize}</td>
                        <td className="py-2 px-3 font-mono">₹{it.price}</td>
                        <td className="py-2 px-3 font-bold font-mono text-[#0D5C3A]">×{it.quantity}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-gray-900">₹{it.itemTotal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Grand Total */}
              <div className="mt-3 text-right font-sans">
                <span className="text-xs text-gray-500 mr-2">Grand Total:</span>
                <span className="text-xl font-black text-[#0D5C3A] font-mono">₹{selectedOrder.total?.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Status Changer Toolbar */}
            <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-700">Change Status:</span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleUpdateOrderStatus(selectedOrder.orderRef, e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-bold focus:border-[#0D5C3A] focus:outline-none"
                >
                  <option value="AWAITING_TRANSPORT_CONFIRMATION">Awaiting Confirmation</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="DISPATCHED">Dispatched</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${selectedOrder.customer?.phone}`}
                  className="px-3 py-1.5 rounded-xl bg-[#0D5C3A] text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Customer</span>
                </a>
                <a
                  href={`https://wa.me/91${(selectedOrder.customer?.phone || '').replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(selectedOrder.customer?.fullName || '')}%2C%20regarding%20your%20Sri%20Natchiyar%20Crackers%20order%20${selectedOrder.orderRef}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-[#25D366] text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

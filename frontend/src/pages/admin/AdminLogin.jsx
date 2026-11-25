import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { ShieldCheck, Lock, User, Eye, EyeOff, Sparkles, ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { login, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already authenticated, redirect to /admin
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error('Please enter both username and password');
      return;
    }

    setSubmitting(true);
    try {
      const res = await login(username.trim(), password);
      if (res.success) {
        toast.success('Admin authentication verified. Welcome back!');
        const from = location.state?.from?.pathname || '/admin';
        navigate(from, { replace: true });
      } else {
        toast.error(res.message || 'Invalid admin credentials');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please check backend server.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrefillDemo = () => {
    setUsername('admin');
    setPassword('admin@natchiyar2026');
    toast('Default admin credentials filled!', { icon: '🔑' });
  };

  return (
    <div className="min-h-screen bg-[#062D1B] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background festive glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-yellow-400/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Back to Storefront Link */}
      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/70 hover:text-white text-xs font-bold transition-colors bg-white/5 hover:bg-white/10 px-3 py-2 rounded-xl border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Storefront</span>
        </button>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Card Container */}
        <div className="bg-[#093822]/90 backdrop-blur-xl border border-emerald-500/40 rounded-3xl p-7 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {/* Header & Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 border border-emerald-400/30 p-2 shadow-inner mb-4">
              <img
                src="/assets/natchiyar_square_logo.png"
                alt="Sri Natchiyar Crackers Emblem"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-white tracking-tight">
              SRI NATCHIYAR
            </h1>
            <p className="text-xs font-bold text-emerald-300 uppercase tracking-widest mt-1">
              Admin Control Center
            </p>
            <p className="text-[11px] text-gray-300 mt-1">
              Manage inventory, live orders, customer leads, and store settings
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-200 uppercase tracking-wider mb-1.5">
                Admin Username or Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-emerald-300 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin or email"
                  required
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/30 border border-emerald-500/50 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-gray-200 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-emerald-300 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-black/30 border border-emerald-500/50 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick prefill credentials pill for easy login */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handlePrefillDemo}
                className="w-full py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-emerald-400/30 text-[11px] font-semibold text-emerald-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                <span>Fill Default Credentials: admin / admin@natchiyar2026</span>
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-3 py-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-sm tracking-wide transition-all shadow-[0_4px_20px_rgba(37,211,102,0.4)] active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 text-white" />
                  <span>Sign In to Admin Portal</span>
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-6 pt-5 border-t border-emerald-500/30 text-center">
            <span className="text-[11px] text-gray-300">
              Authorized Sivakasi Head Office Access Only • 256-Bit SSL Encrypted
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

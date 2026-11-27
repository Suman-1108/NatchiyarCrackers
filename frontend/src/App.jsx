import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import WhatsAppButton from './components/WhatsAppButton';
import FloatingOrderBar from './components/FloatingOrderBar';
import SearchModal from './components/SearchModal';
import SplashScreen from './components/SplashScreen';

// Storefront Pages
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import Gallery from './pages/Gallery';
import Wholesale from './pages/Wholesale';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';

// Admin Console Pages & Route Protection
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';

// Helper component to scroll to top on route navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/portal/admin') || location.pathname.startsWith('/admin');

  return (
    <AdminAuthProvider>
      <CartProvider>
        {/* Branded Splash Screen (Only on Storefront) */}
        {showSplash && !isAdminRoute && (
          <SplashScreen onComplete={() => setShowSplash(false)} />
        )}

        <div className="flex flex-col min-h-screen bg-[#FAF8F5] text-[#18181B] selection:bg-yellow-400 selection:text-[#073822]">
          <ScrollToTop />
          <Toaster
            position="bottom-center"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#FFFFFF',
                color: '#18181B',
                border: '1px solid #E2E8F0',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12)',
                fontSize: '13px',
                fontWeight: 600,
                borderRadius: '12px'
              },
              success: {
                iconTheme: {
                  primary: '#16A34A',
                  secondary: '#FFFFFF',
                },
              },
              error: {
                iconTheme: {
                  primary: '#D81C28',
                  secondary: '#FFFFFF',
                },
              },
            }}
          />

          {/* Customer Global Navigation (Hidden on Admin Routes) */}
          {!isAdminRoute && <Navbar onOpenSearch={() => setIsSearchOpen(true)} />}

          {/* Customer Live Search Modal */}
          {!isAdminRoute && (
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
          )}

          {/* Customer Floating Fireworks Assistant ChatBot */}
          {!isAdminRoute && <ChatBot />}

          {/* Customer Global Floating Order Summary Bar */}
          {!isAdminRoute && <FloatingOrderBar />}

          {/* Main Routed Page Content */}
          <main className="flex-grow">
            <Routes>
              {/* Storefront Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<Navigate to="/products" replace />} />
              <Route path="/gallery" element={<Navigate to="/products" replace />} />
              <Route path="/wholesale" element={<Wholesale />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-conditions" element={<TermsConditions />} />

              {/* Private Admin Portal Routes */}
              <Route path="/portal/admin/login" element={<AdminLogin />} />
              <Route
                path="/portal/admin/dashboard"
                element={
                  <AdminProtectedRoute>
                    <AdminDashboard />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/portal/admin"
                element={<Navigate to="/portal/admin/dashboard" replace />}
              />
              <Route
                path="/portal/admin/*"
                element={
                  <AdminProtectedRoute>
                    <AdminDashboard />
                  </AdminProtectedRoute>
                }
              />

              {/* Legacy /admin redirects */}
              <Route path="/admin/login" element={<Navigate to="/portal/admin/login" replace />} />
              <Route path="/admin" element={<Navigate to="/portal/admin/dashboard" replace />} />
              <Route path="/admin/*" element={<Navigate to="/portal/admin/dashboard" replace />} />

              {/* Fallback to Home */}
              <Route path="*" element={<Home />} />
            </Routes>
          </main>

          {/* Customer Global Footer (Hidden on Admin Routes) */}
          {!isAdminRoute && <Footer />}
        </div>
      </CartProvider>
    </AdminAuthProvider>
  );
}

export default App;

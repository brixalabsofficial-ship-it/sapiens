import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import OrderTracking from './pages/OrderTracking';
import Wishlist from './pages/Wishlist';
import AdminDashboard from './pages/AdminDashboard';
import { PrivacyPolicy, Terms, ShippingPolicy, ReturnPolicy } from './pages/Legal';

// Automatically scroll to the top of the viewport upon any route change
function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname, search]);

  return null;
}

function NotFound() {
  return (
    <div className="max-w-md mx-auto py-24 text-center px-4">
      <h1 className="text-4xl font-bold font-mono text-black mb-2">404</h1>
      <p className="text-sm text-black/60 uppercase tracking-widest mb-6">Page Not Found</p>
      <Link to="/" className="px-6 py-2.5 bg-black text-white text-xs uppercase font-bold tracking-widest hover:bg-[#FF5500] transition-colors">
        Return Home
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col justify-between selection:bg-[#FF5500] selection:text-white">
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmation />} />
              <Route path="/order-tracking" element={<OrderTracking />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="/return-policy" element={<ReturnPolicy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
          <Toaster 
            position="top-center" 
            containerStyle={{
              top: 32
            }}
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: '9999px',
                background: 'rgba(18, 18, 18, 0.94)',
                backdropFilter: 'blur(16px)',
                color: '#fff',
                fontSize: '12.5px',
                fontWeight: '600',
                padding: '10px 22px',
                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(255, 85, 0, 0.15)',
                border: '1px solid rgba(255, 85, 0, 0.35)',
                letterSpacing: '0.02em'
              }
            }}
          />
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

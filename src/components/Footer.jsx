import React from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowRight, Globe, Share2, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 pt-16 pb-24 sm:pb-14 mt-20 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-100">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center">
              <img
                src="/assets/sapiens-logo.jpg"
                alt="SAPIENS"
                className="h-8 w-auto object-contain select-none"
              />
            </Link>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed font-normal">
              Fashion Today. Confidence Tomorrow. Bringing modern, premium-quality streetwear and lifestyle essentials to your doorstep.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#FF5500] hover:text-white flex items-center justify-center transition-colors text-slate-600">
                <Globe size={15} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#FF5500] hover:text-white flex items-center justify-center transition-colors text-slate-600">
                <Share2 size={15} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#FF5500] hover:text-white flex items-center justify-center transition-colors text-slate-600">
                <Mail size={15} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold text-slate-900 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><Link to="/" className="hover:text-[#FF5500] transition-colors">Home</Link></li>
              <li><Link to="/shop" className="hover:text-[#FF5500] transition-colors">Shop All</Link></li>
              <li><Link to="/shop?category=Men" className="hover:text-[#FF5500] transition-colors">Men's Apparel</Link></li>
              <li><Link to="/shop?category=Kids" className="hover:text-[#FF5500] transition-colors">Kids' Line</Link></li>
              <li><Link to="/shop?category=Shoes" className="hover:text-[#FF5500] transition-colors">Footwear</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold text-slate-900 mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><Link to="/order-tracking" className="hover:text-[#FF5500] transition-colors">Track Consignment</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-[#FF5500] transition-colors">Shipping Information</Link></li>
              <li><Link to="/return-policy" className="hover:text-[#FF5500] transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="/privacy" className="hover:text-[#FF5500] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-[#FF5500] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Newsletter Stay Updated (matching reference input with purple/orange arrow button) */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold text-slate-900 mb-2">
              Stay Updated
            </h4>
            <p className="text-xs text-slate-500 mb-3 font-normal">
              Get the latest styles and member offers.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); toast.success('Subscribed to Sapiens Dispatch'); }} className="relative flex items-center">
              <input
                type="email"
                required
                placeholder="Your email address"
                className="w-full bg-slate-50 border border-slate-200/80 rounded-full text-xs px-4 py-2.5 pr-12 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF5500]"
              />
              <button
                type="submit"
                className="absolute right-1 w-8 h-8 rounded-full bg-[#FF5500] text-white flex items-center justify-center hover:bg-[#e04b00] transition-colors shadow-sm"
              >
                <ArrowRight size={14} />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} SAPIENS FASHION INC. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-6 font-medium">
            <Link to="/admin" className="hover:text-slate-700 transition-colors">Admin Management</Link>
            <Link to="/privacy" className="hover:text-slate-700 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-slate-700 transition-colors">Terms</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

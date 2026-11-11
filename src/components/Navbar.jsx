import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, Search, Heart, ShieldCheck, 
  Home, Compass
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { itemCount, wishlist } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (window.scrollY / totalScroll) * 100)));
      }
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const isCategoryActive = (cat) => {
    const params = new URLSearchParams(location.search);
    if (!cat) return location.pathname === '/shop' && !params.get('category');
    return location.pathname === '/shop' && params.get('category')?.toLowerCase() === cat.toLowerCase();
  };

  return (
    <>
      {/* Precision Scroll Progress Indicator */}
      <div 
        className="fixed top-0 left-0 h-[2.5px] bg-[#FF5500] z-50 transition-all duration-150 ease-out shadow-[0_0_8px_rgba(255,85,0,0.8)]"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Floating Dynamic Header on Scroll */}
      <header className={`sticky top-0 z-40 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        scrolled 
          ? 'py-2 sm:py-3.5' 
          : 'py-0'
      }`}>
        <div className={`mx-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled 
            ? 'max-w-5xl px-3 sm:px-6' 
            : 'max-w-7xl px-4 sm:px-6 lg:px-8'
        }`}>
          <div className={`relative flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            scrolled 
              ? 'h-15 sm:h-16 bg-white/85 backdrop-blur-2xl border border-slate-200/90 shadow-[0_16px_36px_rgba(0,0,0,0.08),0_4px_12px_rgba(255,85,0,0.04)] rounded-full px-5 sm:px-7' 
              : 'h-20 bg-transparent border-b border-black/[0.04]'
          }`}>
          
          {/* Left: Brand Logo */}
          <div className="flex items-center z-20">
            <Link to="/" className="flex items-center group">
              <div className="bg-[#FF5500] px-3.5 py-1.5 flex items-center shadow-sm rounded-sm group-hover:bg-[#e04b00] transition-colors">
                <span className="text-white font-black italic tracking-tighter text-xl sm:text-2xl uppercase select-none leading-none">
                  SAPIENS
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Absolute 50% Centered Navigation Links with Active Indicator */}
          <nav 
            className="hidden lg:flex items-center justify-center gap-7 text-sm font-semibold text-slate-700 absolute z-10 pointer-events-auto"
            style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
          >
            <Link 
              to="/" 
              className={`relative py-1.5 transition-colors hover:text-[#FF5500] ${
                location.pathname === '/' ? 'text-[#FF5500] font-bold' : ''
              }`}
            >
              <span>Home</span>
              {location.pathname === '/' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#FF5500] rounded-full" />
              )}
            </Link>

            <Link 
              to="/shop" 
              className={`relative py-1.5 transition-colors hover:text-[#FF5500] ${
                isCategoryActive(null) ? 'text-[#FF5500] font-bold' : ''
              }`}
            >
              <span>Shop All</span>
              {isCategoryActive(null) && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#FF5500] rounded-full" />
              )}
            </Link>

            <Link 
              to="/shop?category=Men" 
              className={`relative py-1.5 transition-colors hover:text-[#FF5500] ${
                isCategoryActive('Men') ? 'text-[#FF5500] font-bold' : ''
              }`}
            >
              <span>Men</span>
              {isCategoryActive('Men') && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#FF5500] rounded-full" />
              )}
            </Link>

            <Link 
              to="/shop?category=Kids" 
              className={`relative py-1.5 transition-colors hover:text-[#FF5500] ${
                isCategoryActive('Kids') ? 'text-[#FF5500] font-bold' : ''
              }`}
            >
              <span>Kids</span>
              {isCategoryActive('Kids') && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#FF5500] rounded-full" />
              )}
            </Link>

            <Link 
              to="/shop?category=Shoes" 
              className={`relative py-1.5 transition-colors hover:text-[#FF5500] ${
                isCategoryActive('Shoes') ? 'text-[#FF5500] font-bold' : ''
              }`}
            >
              <span>Shoes</span>
              {isCategoryActive('Shoes') && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#FF5500] rounded-full" />
              )}
            </Link>

            <Link 
              to="/shop?category=Accessories" 
              className={`relative py-1.5 transition-colors hover:text-[#FF5500] ${
                isCategoryActive('Accessories') ? 'text-[#FF5500] font-bold' : ''
              }`}
            >
              <span>Accessories</span>
              {isCategoryActive('Accessories') && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#FF5500] rounded-full" />
              )}
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3 sm:gap-4 z-20">
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-10 h-10 rounded-full bg-transparent hover:bg-slate-100 text-slate-800 flex items-center justify-center transition-all"
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            {/* Wishlist Button */}
            <Link 
              to="/wishlist" 
              className="relative w-10 h-10 rounded-full bg-transparent hover:bg-slate-100 text-slate-800 flex items-center justify-center transition-all"
              title="Wishlist"
            >
              <Heart size={18} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Shopping Bag Button */}
            <Link 
              to="/cart" 
              className="flex items-center gap-2 pl-3.5 pr-4 py-2 rounded-full bg-black text-white hover:bg-slate-800 transition-all shadow-sm"
              title="Shopping Bag"
            >
              <ShoppingBag size={17} />
              <span className="text-xs font-bold tabular-nums">
                {itemCount}
              </span>
            </Link>

            {/* Admin Shortcut */}
            <Link
              to="/admin"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-transparent border border-slate-300 text-slate-800 hover:bg-slate-100 transition-all"
            >
              <ShieldCheck size={14} />
              <span>Admin</span>
            </Link>
          </div>
          </div>
        </div>

        {/* Search Bar Drawer */}
        {searchOpen && (
          <div className="max-w-3xl mx-auto px-4 mt-2">
            <div className="border border-slate-200/80 bg-white/95 backdrop-blur-xl rounded-2xl px-4 py-3 shadow-xl animate-fadeIn">
              <form onSubmit={handleSearch} className="flex items-center gap-3">
                <Search size={18} className="text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search styles, categories, collections..."
                  className="w-full text-sm sm:text-base focus:outline-none placeholder:text-slate-400 font-medium bg-transparent"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-black text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  ✕
                </button>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Floating Mobile Bottom Navigation Bar with SAPIENS Orange Accents */}
      <div className="lg:hidden fixed bottom-4 inset-x-4 z-40">
        <nav className="relative bg-white/92 backdrop-blur-2xl border border-orange-500/25 px-2 py-1.5 shadow-[0_12px_36px_rgba(255,85,0,0.14),0_4px_16px_rgba(0,0,0,0.08)] rounded-2xl flex items-center justify-around text-slate-800 overflow-hidden">
          
          {/* Subtle Top Accent Shimmer Line */}
          <div className="absolute top-0 inset-x-6 h-[2px] bg-gradient-to-r from-transparent via-[#FF5500] to-transparent opacity-80" />

          {/* Home Link */}
          <Link
            to="/"
            className={`relative flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all duration-200 ${
              isActive('/') 
                ? 'text-[#FF5500] font-extrabold bg-orange-500/10' 
                : 'text-slate-500 hover:text-[#FF5500]'
            }`}
          >
            <Home size={19} className={`transition-transform ${isActive('/') ? 'scale-110' : ''}`} />
            <span className="text-[10px] tracking-tight">Home</span>
            {isActive('/') && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] mt-0.5" />
            )}
          </Link>

          {/* Shop Link */}
          <Link
            to="/shop"
            className={`relative flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all duration-200 ${
              isActive('/shop') 
                ? 'text-[#FF5500] font-extrabold bg-orange-500/10' 
                : 'text-slate-500 hover:text-[#FF5500]'
            }`}
          >
            <Compass size={19} className={`transition-transform ${isActive('/shop') ? 'scale-110' : ''}`} />
            <span className="text-[10px] tracking-tight">Shop</span>
            {isActive('/shop') && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] mt-0.5" />
            )}
          </Link>

          {/* Wishlist Link */}
          <Link
            to="/wishlist"
            className={`relative flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all duration-200 ${
              isActive('/wishlist') 
                ? 'text-[#FF5500] font-extrabold bg-orange-500/10' 
                : 'text-slate-500 hover:text-[#FF5500]'
            }`}
          >
            <Heart size={19} className={`transition-transform ${isActive('/wishlist') ? 'scale-110' : ''}`} />
            <span className="text-[10px] tracking-tight">Saved</span>
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-2 w-4 h-4 bg-[#FF5500] text-white text-[9px] font-bold flex items-center justify-center rounded-full shadow-sm shadow-orange-500/50">
                {wishlist.length}
              </span>
            )}
            {isActive('/wishlist') && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] mt-0.5" />
            )}
          </Link>

          {/* Bag / Cart Link */}
          <Link
            to="/cart"
            className={`relative flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all duration-200 ${
              isActive('/cart') 
                ? 'text-[#FF5500] font-extrabold bg-orange-500/10' 
                : 'text-slate-500 hover:text-[#FF5500]'
            }`}
          >
            <ShoppingBag size={19} className={`transition-transform ${isActive('/cart') ? 'scale-110' : ''}`} />
            <span className="text-[10px] tracking-tight">Bag</span>
            {itemCount > 0 && (
              <span className="absolute top-1 right-1.5 w-4 h-4 bg-[#FF5500] text-white text-[9px] font-bold flex items-center justify-center rounded-full shadow-sm shadow-orange-500/50">
                {itemCount}
              </span>
            )}
            {isActive('/cart') && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] mt-0.5" />
            )}
          </Link>

          {/* Admin Link */}
          <Link
            to="/admin"
            className={`relative flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all duration-200 ${
              isActive('/admin') 
                ? 'text-[#FF5500] font-extrabold bg-orange-500/10' 
                : 'text-slate-500 hover:text-[#FF5500]'
            }`}
          >
            <ShieldCheck size={19} className={`transition-transform ${isActive('/admin') ? 'scale-110' : ''}`} />
            <span className="text-[10px] tracking-tight">Admin</span>
            {isActive('/admin') && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] mt-0.5" />
            )}
          </Link>
        </nav>
      </div>
    </>
  );
}

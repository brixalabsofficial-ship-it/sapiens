import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, ShieldCheck, Truck, RotateCcw, 
  ChevronRight, Award, Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/UIFeedback';
import { fetchProducts } from '../services/api';

const EDITORIAL_LOOKS = [
  {
    id: "look-01",
    lookNumber: "01",
    label: "Bespoke Double-Breasted Suit",
    category: "Men",
    slug: "sartorial-bespoke-double-breasted-wool-suit",
    season: "Autumn / Winter 2026",
    headlinePrimary: "Architectural Form",
    headlineAccent: "Bespoke Sartorial",
    description: "Crafted in Biella from Super 150s virgin Italian wool. Features hand-stitched horsehair canvas chest piece, broad peak lapels, and natural horn button closures.",
    image: "https://images.pexels.com/photos/1342609/pexels-photo-1342609.jpeg",
    price: "₹18,499",
    specs: [
      { label: "Fabric", val: "Super 150s Italian Wool" },
      { label: "Structure", val: "Full Horsehair Canvas" },
      { label: "Origin", val: "Milan Atelier" }
    ]
  },
  {
    id: "look-02",
    lookNumber: "02",
    label: "Milano Silk-Lapel Tuxedo",
    category: "Men",
    slug: "milano-tailored-slim-fit-tuxedo-blazer",
    season: "Occasion & Black-Tie",
    headlinePrimary: "Nocturne Elegance",
    headlineAccent: "Black-Tie Form",
    description: "Evening wear blazer in midnight black with pure silk satin shawl lapels, single jetted pockets, and structured roped shoulders engineered for formal occasions.",
    image: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg",
    price: "₹16,999",
    specs: [
      { label: "Lapel", val: "Silk Satin Shawl" },
      { label: "Fit", val: "Sculpted Milano Cut" },
      { label: "Lining", val: "Cupro Bemberg" }
    ]
  },
  {
    id: "look-03",
    lookNumber: "03",
    label: "Double-Faced Cashmere Overcoat",
    category: "Men",
    slug: "architectural-cashmere-blend-trench-overcoat",
    season: "Winter Outerwear",
    headlinePrimary: "Sculptural Form",
    headlineAccent: "Cashmere Architecture",
    description: "Double-faced cashmere and virgin wool blend tailored in an editorial silhouette with broad notched lapels, horn closure, and unstructured fluid drape.",
    image: "https://images.pexels.com/photos/3760854/pexels-photo-3760854.jpeg",
    price: "₹15,499",
    specs: [
      { label: "Composition", val: "Cashmere & Virgin Wool" },
      { label: "Silhouette", val: "Architectural Trench" },
      { label: "Finish", val: "Hand-Split Seams" }
    ]
  }
];

const CATEGORIES_DATA = [
  {
    name: "Occasion & Suits",
    category: "Men",
    itemCount: "48+ Styles",
    image: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg",
    gradient: "from-orange-100/60 to-rose-50"
  },
  {
    name: "Junior Heritage",
    category: "Kids",
    itemCount: "26+ Styles",
    image: "https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg",
    gradient: "from-amber-100/60 to-orange-50"
  },
  {
    name: "Handcrafted Footwear",
    category: "Shoes",
    itemCount: "32+ Styles",
    image: "https://images.pexels.com/photos/267320/pexels-photo-267320.jpeg",
    gradient: "from-orange-100/50 to-slate-100"
  },
  {
    name: "Horology & Leather",
    category: "Accessories",
    itemCount: "40+ Styles",
    image: "https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg",
    gradient: "from-orange-50 to-amber-100/40"
  }
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeLookIdx, setActiveLookIdx] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const prods = await fetchProducts();
        setFeaturedProducts(prods.slice(0, 8));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Autoplay lookbook carousel every 6s
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveLookIdx((prev) => (prev + 1) % EDITORIAL_LOOKS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const currentLook = EDITORIAL_LOOKS[activeLookIdx];

  return (
    <div className="space-y-16 sm:space-y-24 pb-12">
      
      {/* 1. EDITORIAL LUXURY FASHION HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F7F5F0] via-white to-white border-b border-black/[0.05]">
        
        {/* Top Provenance Marquee / Ticker */}
        <div className="border-b border-black/[0.06] bg-black/[0.02] py-2.5 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] uppercase tracking-[0.2em] font-semibold text-slate-500 overflow-x-auto whitespace-nowrap gap-6 scrollbar-none">
            <span className="flex items-center gap-2 text-black font-extrabold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500]" />
              SAPIENS ATELIER
            </span>
            <span className="text-slate-300">•</span>
            <span>AUTUMN / WINTER 2026</span>
            <span className="text-slate-300">•</span>
            <span>SUPER 150S VIRGIN WOOL</span>
            <span className="text-slate-300">•</span>
            <span>FULL HORSEHAIR CANVAS</span>
            <span className="text-slate-300">•</span>
            <span>MILANO & SAVILE ROW CUT</span>
            <span className="text-slate-300">•</span>
            <span>EXPRESS CONCIERGE DELIVERY</span>
          </div>
        </div>

        {/* Hero Content Stage */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Bold Typography & Look Selector */}
            <div className="lg:col-span-7 flex flex-col items-center text-center lg:items-start lg:text-left justify-between">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeLookIdx}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="space-y-5 flex flex-col items-center lg:items-start"
                >
                  {/* Collection Header Tag */}
                  <div className="flex items-center justify-center lg:justify-start gap-3">
                    <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#FF5500] font-bold">
                      LOOK {currentLook.lookNumber} / 03
                    </span>
                    <span className="h-3 w-[1px] bg-slate-300" />
                    <span className="text-xs uppercase tracking-widest text-slate-500 font-medium">
                      {currentLook.season}
                    </span>
                  </div>

                  {/* High-Impact Editorial Headline */}
                  <h1 className="text-4xl sm:text-6xl lg:text-[4.25rem] font-black tracking-tight text-slate-900 leading-[1.04]">
                    {currentLook.headlinePrimary}
                    <span className="block text-[#FF5500] font-serif italic font-normal tracking-tight mt-1.5">
                      & {currentLook.headlineAccent}
                    </span>
                  </h1>

                  {/* Editorial Description */}
                  <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-xl font-normal leading-relaxed mx-auto lg:mx-0">
                    {currentLook.description}
                  </p>

                  {/* Atelier Specs Pills */}
                  <div className="flex flex-wrap justify-center lg:justify-start gap-2 pt-2">
                    {currentLook.specs.map((spec, i) => (
                      <div 
                        key={i} 
                        className="px-3.5 py-1.5 bg-white border border-slate-200/80 rounded-full text-xs text-slate-700 shadow-sm flex items-center gap-2"
                      >
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                          {spec.label}:
                        </span>
                        <span className="font-bold text-slate-900">
                          {spec.val}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Mobile Hero Visual Stage (Centered & Prominently positioned on mobile) */}
              <div className="lg:hidden w-full flex justify-center pt-5 pb-3">
                <div className="relative w-full max-w-[340px] aspect-[3/4] rounded-2xl overflow-hidden bg-slate-900 shadow-2xl border-2 border-white">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activeLookIdx}
                      src={currentLook.image}
                      alt={currentLook.label}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.pexels.com/photos/1342609/pexels-photo-1342609.jpeg';
                      }}
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.4 }}
                      className="w-full h-full object-cover object-top"
                    />
                  </AnimatePresence>

                  {/* Mobile Corner Tag */}
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[10px] font-mono uppercase tracking-widest border border-white/20">
                    LOOK {currentLook.lookNumber} • SAPIENS
                  </div>

                  {/* Mobile Bottom Frosted Glass Info Pill */}
                  <div className="absolute bottom-3 inset-x-3 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-white/50 flex items-center justify-between shadow-lg">
                    <div>
                      <p className="text-[10px] font-mono text-[#FF5500] uppercase font-bold tracking-wider">
                        {currentLook.season}
                      </p>
                      <p className="text-xs font-black text-slate-900 line-clamp-1">
                        {currentLook.label}
                      </p>
                    </div>
                    <span className="text-xs font-black text-[#FF5500] tabular-nums">
                      {currentLook.price}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4 sm:pt-8 w-full">
                <Link
                  to="/shop"
                  className="px-8 py-4 rounded-full bg-black text-white text-xs font-extrabold uppercase tracking-widest hover:bg-[#FF5500] transition-colors shadow-lg shadow-black/10 flex items-center gap-2 group active:scale-95"
                >
                  <span>Explore Collection</span>
                  <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform" />
                </Link>

                <Link
                  to={`/product/${currentLook.slug}`}
                  className="px-6 py-4 rounded-full bg-white text-slate-800 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-all border border-slate-300 shadow-sm flex items-center gap-2 active:scale-95"
                >
                  <span>Acquire Look {currentLook.lookNumber}</span>
                  <span className="text-[#FF5500] font-black tabular-nums">{currentLook.price}</span>
                </Link>
              </div>

              {/* Interactive Lookbook Tabs Selector */}
              <div className="mt-8 sm:mt-10 pt-6 border-t border-slate-200/70 w-full">
                <p className="text-[10px] uppercase font-mono tracking-widest text-slate-400 mb-3 text-center lg:text-left">
                  Select Curated Look:
                </p>
                <div className="grid grid-cols-3 gap-2 sm:gap-3.5">
                  {EDITORIAL_LOOKS.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveLookIdx(idx)}
                      className={`text-left p-3 sm:p-3.5 rounded-2xl transition-all duration-300 border ${
                        activeLookIdx === idx
                          ? 'bg-white border-[#FF5500] shadow-[0_4px_16px_rgba(255,85,0,0.12)]'
                          : 'bg-white/50 border-slate-200/80 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                        <span>LOOK {item.lookNumber}</span>
                        {activeLookIdx === idx && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] animate-pulse" />
                        )}
                      </div>
                      <p className={`text-xs font-bold line-clamp-1 ${activeLookIdx === idx ? 'text-black' : 'text-slate-600'}`}>
                        {item.label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: High-Fashion Model Portrait Stage (Desktop) */}
            <div className="hidden lg:flex lg:col-span-5 justify-end">
              <div className="relative w-full max-w-[420px] aspect-[3/4] rounded-3xl overflow-hidden bg-slate-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] border-2 border-white">
                
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeLookIdx}
                    src={currentLook.image}
                    alt={currentLook.label}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.pexels.com/photos/1342609/pexels-photo-1342609.jpeg';
                    }}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                    className="w-full h-full object-cover object-top"
                  />
                </AnimatePresence>

                {/* Corner Season Pill */}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-white text-[10px] font-mono uppercase tracking-widest">
                  LOOK {currentLook.lookNumber} • SAPIENS
                </div>

                {/* Bottom Frosted Look Card */}
                <div className="absolute bottom-4 inset-x-4 bg-white/95 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-white/40 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF5500] font-bold">
                      {currentLook.season}
                    </span>
                    <h3 className="text-sm font-black text-slate-900 leading-snug">
                      {currentLook.label}
                    </h3>
                    <p className="text-xs font-extrabold text-[#FF5500] tabular-nums mt-0.5">
                      {currentLook.price}
                    </p>
                  </div>

                  <Link
                    to={`/product/${currentLook.slug}`}
                    className="w-10 h-10 rounded-full bg-black text-white hover:bg-[#FF5500] transition-colors flex items-center justify-center shrink-0 shadow-sm"
                    title="View Product"
                  >
                    <ArrowRight size={16} />
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* Trust Indicators Minimal Row */}
        <div className="border-t border-black/[0.06] bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-slate-800">
              <div className="flex items-center gap-3">
                <Truck size={18} className="text-[#FF5500] shrink-0" />
                <div className="text-xs">
                  <p className="font-bold">Complimentary Delivery</p>
                  <p className="text-[11px] text-slate-400">On all orders above ₹3,000</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Award size={18} className="text-[#FF5500] shrink-0" />
                <div className="text-xs">
                  <p className="font-bold">Bespoke Italian Craft</p>
                  <p className="text-[11px] text-slate-400">Super 150s & Full Canvas</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <RotateCcw size={18} className="text-[#FF5500] shrink-0" />
                <div className="text-xs">
                  <p className="font-bold">7-Day Return Policy</p>
                  <p className="text-[11px] text-slate-400">Doorstep pickup assistance</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Compass size={18} className="text-[#FF5500] shrink-0" />
                <div className="text-xs">
                  <p className="font-bold">Concierge Support</p>
                  <p className="text-[11px] text-slate-400">Styling & sizing via WhatsApp</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* 2. SHOP BY CATEGORY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FF5500]">
              <span className="w-5 h-[2px] bg-[#FF5500] inline-block" />
              <span>Shop By Category</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
              Find Your Perfect Style
            </h2>
          </div>

          <Link
            to="/shop"
            className="text-xs sm:text-sm font-bold text-slate-700 hover:text-[#FF5500] flex items-center gap-1 transition-colors"
          >
            <span>View All Categories</span>
            <ChevronRight size={16} />
          </Link>
        </div>

        {/* 4 Category Clean Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-5">
          {CATEGORIES_DATA.map((cat, idx) => (
            <Link
              key={idx}
              to={`/shop?category=${cat.category}`}
              className="sapiens-modern-card group flex flex-col bg-white rounded-none sm:rounded-md overflow-hidden border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
            >
              <div className="relative aspect-[4/5] sm:aspect-square w-full overflow-hidden flex items-center justify-center bg-slate-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.pexels.com/photos/1342609/pexels-photo-1342609.jpeg';
                  }}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              </div>

              <div className="p-2.5 sm:p-3 flex items-center justify-between">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#FF5500] transition-colors line-clamp-1">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] sm:text-xs text-slate-400 font-medium">
                    {cat.itemCount}
                  </span>
                </div>
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-50 text-slate-400 group-hover:bg-[#FF5500] group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                  <ArrowRight size={12} />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </section>

      {/* 3. FEATURED PRODUCTS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-end justify-between mb-6 sm:mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FF5500]">
              <span className="w-5 h-[2px] bg-[#FF5500] inline-block" />
              <span>Featured Products</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
              Best Sellers
            </h2>
          </div>

          <Link
            to="/shop"
            className="text-xs sm:text-sm font-bold text-slate-700 hover:text-[#FF5500] flex items-center gap-1 transition-colors"
          >
            <span>View All Products</span>
            <ChevronRight size={16} />
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-5">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

      </section>

      {/* 4. MODERN BRAND PROMO BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-[#111111] text-white rounded-3xl sm:rounded-[2.5rem] p-8 sm:p-14 overflow-hidden shadow-2xl">
          
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-[#FF5500]/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-10 top-0 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            
            <div className="lg:col-span-5 relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg"
                  alt="Quality Fashion"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>

            <div className="lg:col-span-4 space-y-4">
              <span className="text-xs font-bold tracking-widest uppercase text-[#FF5500]">
                Your Style. Our Passion.
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Quality Fashion <br />
                At Your Fingertips
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                Join thousands of happy customers who trust Sapiens for their everyday fashion, footwear, and accessories.
              </p>
              <div className="pt-2">
                <Link
                  to="/shop"
                  className="px-8 py-3.5 rounded-full bg-[#FF5500] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#e04b00] transition-colors inline-flex items-center gap-2 shadow-lg shadow-orange-500/30"
                >
                  <span>Shop Now</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-3 grid grid-cols-1 gap-6 border-t lg:border-t-0 lg:border-l border-white/15 pt-6 lg:pt-0 lg:pl-8">
              <div>
                <div className="text-3xl font-black text-white tabular-nums">10K+</div>
                <div className="text-xs text-slate-400 font-medium">Happy Customers</div>
              </div>

              <div>
                <div className="text-3xl font-black text-white tabular-nums">500+</div>
                <div className="text-xs text-slate-400 font-medium">Curated Products</div>
              </div>

              <div>
                <div className="text-3xl font-black text-[#FF5500] tabular-nums">Worldwide</div>
                <div className="text-xs text-slate-400 font-medium">Express Shipping</div>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}

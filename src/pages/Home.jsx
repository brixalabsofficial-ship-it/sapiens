import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, ShieldCheck, Truck, RotateCcw, 
  ChevronRight, ChevronLeft, Award, Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/UIFeedback';
import { fetchProducts } from '../services/api';

const HERO_SLIDES = [
  {
    id: 1,
    image: "https://images.pexels.com/photos/1342609/pexels-photo-1342609.jpeg",
    title: "Double-Breasted Wool Suit",
    badge: "Atelier Bespoke",
    slug: "sartorial-bespoke-double-breasted-wool-suit"
  },
  {
    id: 2,
    image: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg",
    title: "Milano Silk-Lapel Tuxedo",
    badge: "Black-Tie Form",
    slug: "milano-tailored-slim-fit-tuxedo-blazer"
  },
  {
    id: 3,
    image: "https://images.pexels.com/photos/2897883/pexels-photo-2897883.jpeg",
    title: "Cashmere Trench Overcoat",
    badge: "Winter Outerwear",
    slug: "architectural-cashmere-blend-trench-overcoat"
  },
  {
    id: 4,
    image: "https://images.pexels.com/photos/325876/pexels-photo-325876.jpeg",
    title: "Structured Navy Occasion Suit",
    badge: "Sartorial Edition",
    slug: "classic-structured-navy-occasion-suit"
  }
];

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 1.04
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: "spring", stiffness: 280, damping: 28 },
      opacity: { duration: 0.35 },
      scale: { duration: 0.5 }
    }
  },
  exit: (direction) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.96,
    transition: {
      x: { type: "spring", stiffness: 280, damping: 28 },
      opacity: { duration: 0.3 }
    }
  })
};

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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  // Featured Products Carousel State
  const carouselRef = useRef(null);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const prods = await fetchProducts();
        setFeaturedProducts(prods.slice(0, 12));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Auto-slide hero images every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Auto-slide featured products carousel every 3.5 seconds
  useEffect(() => {
    if (isCarouselPaused || !featuredProducts.length) return;

    const interval = setInterval(() => {
      const container = carouselRef.current;
      if (!container) return;

      const card = container.firstElementChild;
      const step = card ? card.offsetWidth + 16 : 300;
      const maxScroll = container.scrollWidth - container.clientWidth;

      if (container.scrollLeft >= maxScroll - 15) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: step, behavior: 'smooth' });
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isCarouselPaused, featuredProducts]);

  const scrollPrevProducts = () => {
    const container = carouselRef.current;
    if (!container) return;
    const card = container.firstElementChild;
    const step = card ? card.offsetWidth + 16 : 300;
    container.scrollBy({ left: -step, behavior: 'smooth' });
  };

  const scrollNextProducts = () => {
    const container = carouselRef.current;
    if (!container) return;
    const card = container.firstElementChild;
    const step = card ? card.offsetWidth + 16 : 300;
    const maxScroll = container.scrollWidth - container.clientWidth;
    if (container.scrollLeft >= maxScroll - 15) {
      container.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: step, behavior: 'smooth' });
    }
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const goToSlide = (idx) => {
    setDirection(idx > currentSlide ? 1 : -1);
    setCurrentSlide(idx);
  };

  const activeSlide = HERO_SLIDES[currentSlide];

  return (
    <div className="space-y-16 sm:space-y-24 pb-12">
      
      {/* 1. CLEAN & SIMPLE LUXURY HERO SECTION */}
      <section className="relative overflow-hidden bg-[#FAF9F6] border-b border-black/[0.06]">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Clean Editorial Messaging with Generous Spacing */}
            <div className="lg:col-span-7 flex flex-col items-center text-center lg:items-start lg:text-left space-y-7 sm:space-y-8">
              
              {/* Season Minimal Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-black/[0.08] rounded-full shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#FF5500]" />
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-800 font-bold">
                  Autumn / Winter 2026 Collection
                </span>
              </div>

              {/* Bold, Clean Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.08] space-y-1">
                <span className="block">Bespoke Elegance.</span>
                <span className="block text-[#FF5500] font-serif italic font-normal mt-1.5">
                  Modern Sartorial.
                </span>
              </h1>

              {/* 1-Sentence Subtitle with clean max-width */}
              <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-lg font-normal leading-relaxed px-2 sm:px-0">
                Handcrafted Italian wool and architectural tailoring, engineered for life's defining occasions.
              </p>

              {/* Action Buttons: Always Horizontal on Mobile & Desktop */}
              <div className="flex flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-3 sm:pt-4 w-full max-w-md">
                <Link
                  to="/shop"
                  className="flex-1 sm:flex-initial px-5 sm:px-7 py-3 sm:py-3.5 rounded-full bg-black text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider hover:bg-[#FF5500] transition-colors shadow-md flex items-center justify-center gap-2 group whitespace-nowrap active:scale-95"
                >
                  <span>Explore Collection</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform shrink-0" />
                </Link>

                <Link
                  to="/shop?category=Men"
                  className="flex-1 sm:flex-initial px-5 sm:px-7 py-3 sm:py-3.5 rounded-full bg-white text-slate-800 text-[11px] sm:text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-all border border-slate-300 shadow-xs flex items-center justify-center text-center whitespace-nowrap active:scale-95"
                >
                  <span>Occasion Suits</span>
                </Link>
              </div>

            </div>

            {/* Right Column / Mobile Hero Visual with Smooth Slide Animation */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end pt-4 lg:pt-0">
              <div className="relative w-full max-w-[340px] sm:max-w-[380px] lg:max-w-[420px] aspect-[3/4] rounded-2xl overflow-hidden bg-slate-900 shadow-2xl border-2 border-white group select-none">
                
                {/* Sliding Image Stage */}
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                  <motion.img
                    key={activeSlide.id}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    src={activeSlide.image}
                    alt={activeSlide.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg';
                    }}
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />
                </AnimatePresence>

                {/* Subtle Gradient Overlay for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/25 pointer-events-none" />

                {/* Top Corner Slide Counter */}
                <div className="absolute top-3.5 left-3.5 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[10px] font-mono uppercase tracking-widest border border-white/20 z-10">
                  {String(currentSlide + 1).padStart(2, '0')} / {String(HERO_SLIDES.length).padStart(2, '0')}
                </div>

                {/* Arrow Controls (Smooth hover on desktop) */}
                <button
                  onClick={prevSlide}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/75 backdrop-blur-md text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10 cursor-pointer active:scale-90"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/75 backdrop-blur-md text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10 cursor-pointer active:scale-90"
                  aria-label="Next Slide"
                >
                  <ChevronRight size={16} />
                </button>

                {/* Bottom Navigation Indicators (Dashes) */}
                <div className="absolute bottom-16 inset-x-0 flex items-center justify-center gap-1.5 z-10">
                  {HERO_SLIDES.map((slide, idx) => (
                    <button
                      key={slide.id}
                      onClick={() => goToSlide(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        currentSlide === idx 
                          ? 'w-6 bg-[#FF5500]' 
                          : 'w-2 bg-white/60 hover:bg-white'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Minimal Overlay Badge */}
                <div className="absolute bottom-3 inset-x-3 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-white/60 flex items-center justify-between shadow-sm z-10">
                  <div className="min-w-0 pr-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF5500] font-bold block truncate">
                      {activeSlide.badge}
                    </span>
                    <p className="text-xs font-black text-slate-900 leading-tight mt-0.5 truncate">
                      {activeSlide.title}
                    </p>
                  </div>
                  <Link
                    to={`/product/${activeSlide.slug}`}
                    className="w-8 h-8 rounded-full bg-black text-white hover:bg-[#FF5500] transition-colors flex items-center justify-center shrink-0"
                    title={`View ${activeSlide.title}`}
                  >
                    <ArrowRight size={14} />
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

        {/* 4 Category Editorial Full-Bleed Lookbook Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-5">
          {CATEGORIES_DATA.map((cat, idx) => (
            <Link
              key={idx}
              to={`/shop?category=${cat.category}`}
              className="group relative aspect-[3/4] w-full overflow-hidden rounded-none sm:rounded-md bg-slate-900 shadow-md block border border-black/5"
            >
              {/* Full-Bleed Image Spanning 100% of the Card */}
              <img
                src={cat.image}
                alt={cat.name}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.pexels.com/photos/1342609/pexels-photo-1342609.jpeg';
                }}
                className="w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700 ease-out brightness-[0.92]"
              />

              {/* Bottom Editorial Dark Gradient Overlay with High-Contrast Typography */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent flex flex-col justify-end p-3 sm:p-5">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#FF5500] font-bold mb-1">
                  {cat.itemCount}
                </span>
                <div className="flex items-end justify-between">
                  <h3 className="text-xs sm:text-base font-black text-white uppercase tracking-tight group-hover:text-[#FF5500] transition-colors leading-tight">
                    {cat.name}
                  </h3>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/20 backdrop-blur-md text-white group-hover:bg-[#FF5500] group-hover:text-white flex items-center justify-center transition-colors shrink-0 ml-1.5">
                    <ArrowRight size={13} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </section>

      {/* 3. FEATURED PRODUCTS AUTO-SLIDE CAROUSEL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-end justify-between mb-6 sm:mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FF5500]">
              <span className="w-5 h-[2px] bg-[#FF5500] inline-block" />
              <span>Featured Collection</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
              Best Sellers
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Carousel Navigation Arrows */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={scrollPrevProducts}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white hover:bg-black hover:text-white text-slate-700 border border-slate-200 transition-colors flex items-center justify-center shadow-xs active:scale-90 cursor-pointer"
                aria-label="Previous products"
                title="Previous"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={scrollNextProducts}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white hover:bg-black hover:text-white text-slate-700 border border-slate-200 transition-colors flex items-center justify-center shadow-xs active:scale-90 cursor-pointer"
                aria-label="Next products"
                title="Next"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <Link
              to="/shop"
              className="text-xs sm:text-sm font-bold text-slate-700 hover:text-[#FF5500] flex items-center gap-1 transition-colors pl-2"
            >
              <span className="hidden sm:inline">View All</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div 
            ref={carouselRef}
            onMouseEnter={() => setIsCarouselPaused(true)}
            onMouseLeave={() => setIsCarouselPaused(false)}
            onTouchStart={() => setIsCarouselPaused(true)}
            onTouchEnd={() => setIsCarouselPaused(false)}
            className="flex gap-3 sm:gap-5 overflow-x-auto scrollbar-none snap-x snap-mandatory py-2 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth"
          >
            {featuredProducts.map((p) => (
              <div 
                key={p.id} 
                className="w-[68vw] sm:w-[270px] md:w-[285px] lg:w-[295px] shrink-0 snap-start"
              >
                <ProductCard product={p} />
              </div>
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

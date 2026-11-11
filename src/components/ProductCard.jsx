import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { wishlist, toggleWishlist } = useCart();
  const isWishlisted = wishlist.some(w => w.id === product.id);

  const initialImg = product.images?.[0] || 'https://images.pexels.com/photos/1342609/pexels-photo-1342609.jpeg';
  const [currentImg, setCurrentImg] = useState(initialImg);

  const colors = [...new Set(product.variants?.map(v => v.color) || [])];
  const discountPercent = product.compareAtPrice 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : null;

  const handleImageError = () => {
    // If secondary image exists and hasn't been tried, use it
    if (product.images?.[1] && currentImg !== product.images[1]) {
      setCurrentImg(product.images[1]);
    } else {
      // Guaranteed rock-solid fallback
      setCurrentImg('https://images.pexels.com/photos/1342609/pexels-photo-1342609.jpeg');
    }
  };

  return (
    <div className="sapiens-modern-card group flex flex-col bg-white rounded-3xl p-3 sm:p-3.5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-orange-100">
      
      {/* Product Image Stage */}
      <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center">
        
        {/* Discount Badge */}
        {discountPercent ? (
          <span className="absolute top-3 left-3 bg-[#FF5500] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm z-10">
            -{discountPercent}%
          </span>
        ) : product.isNew ? (
          <span className="absolute top-3 left-3 bg-black text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm z-10">
            New
          </span>
        ) : null}

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-slate-700 hover:text-[#FF5500] shadow-sm flex items-center justify-center transition-transform active:scale-90 z-10"
          aria-label="Wishlist"
        >
          <Heart size={15} className={isWishlisted ? "fill-[#FF5500] text-[#FF5500]" : ""} />
        </button>

        {/* Product Image with clean zoom & error protection */}
        <Link to={`/product/${product.slug}`} className="w-full h-full block">
          <img
            src={currentImg}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={handleImageError}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
        </Link>
      </div>

      {/* Product Details */}
      <div className="pt-3.5 pb-1 px-1.5 flex flex-col flex-1">
        
        <Link
          to={`/product/${product.slug}`}
          className="text-sm font-bold text-slate-800 hover:text-[#FF5500] transition-colors line-clamp-1 mb-0.5"
        >
          {product.name}
        </Link>

        <span className="text-xs text-slate-400 font-medium mb-2">
          {product.category} {product.gender ? `• ${product.gender}` : ''}
        </span>

        {/* Price Row */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <div className="flex items-baseline gap-2 tabular-nums">
            <span className="text-base font-extrabold text-[#FF5500]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-slate-400 line-through font-normal">
                ₹{product.compareAtPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

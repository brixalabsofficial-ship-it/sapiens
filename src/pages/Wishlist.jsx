import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

export default function Wishlist() {
  const { wishlist } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="inline-flex p-5 rounded-full bg-black/5 text-black/40 mb-4">
          <Heart size={32} />
        </div>
        <h2 className="text-2xl font-light uppercase tracking-tight text-black mb-2">
          Your Saved Pieces List Is Empty
        </h2>
        <p className="text-xs sm:text-sm text-black/60 max-w-sm mx-auto mb-8 font-light">
          Save your favorite luxury streetwear pieces to review anytime.
        </p>
        <Link
          to="/shop"
          className="px-8 py-3.5 bg-black text-white text-xs uppercase font-bold tracking-widest hover:bg-[#FF5500] transition-colors"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="border-b border-black/10 pb-4 mb-8">
        <span className="text-xs uppercase tracking-widest text-[#FF5500] font-bold">Curated Archive</span>
        <h1 className="text-3xl font-light uppercase tracking-tight text-black">
          My Saved Pieces ({wishlist.length})
        </h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
        {wishlist.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </div>
  );
}

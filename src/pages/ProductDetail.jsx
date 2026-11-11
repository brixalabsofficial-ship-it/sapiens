import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Truck, RotateCcw, Check, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { fetchProductBySlug } from '../services/api';
import ProductCard from '../components/ProductCard';
import { ProductDetailSkeleton, Spinner } from '../components/UIFeedback';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, wishlist, toggleWishlist } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetchProductBySlug(slug);
        if (res && res.data) {
          setProduct(res.data);
          setRelated(res.related || []);
          setSelectedImage(0);

          // Defaults
          if (res.data.variants && res.data.variants.length > 0) {
            setSelectedSize(res.data.variants[0].size);
            setSelectedColor(res.data.variants[0].color);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) return <ProductDetailSkeleton />;
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-light uppercase tracking-tight mb-4">Product Not Found</h2>
        <Link to="/shop" className="px-6 py-2.5 bg-black text-white text-xs uppercase font-bold tracking-widest">
          Return to Shop
        </Link>
      </div>
    );
  }

  // Extract distinct sizes & colors
  const sizes = [...new Set(product.variants?.map(v => v.size) || [])];
  const colors = [...new Set(product.variants?.map(v => v.color) || [])];

  // Current matched variant
  const currentVariant = product.variants?.find(
    v => v.size === selectedSize && v.color === selectedColor
  ) || product.variants?.[0];

  const isOutOfStock = !currentVariant || currentVariant.stock <= 0;
  const isWishlisted = wishlist.some(w => w.id === product.id);

  const handleAddToCart = (buyNow = false) => {
    setIsAdding(true);
    setTimeout(() => {
      const ok = addToCart(product, currentVariant, quantity);
      setIsAdding(false);
      if (ok && buyNow) {
        navigate('/checkout');
      }
    }, 250);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Breadcrumbs */}
      <nav className="text-xs uppercase tracking-wider text-black/50 mb-8 flex items-center gap-2">
        <Link to="/" className="hover:text-black">Home</Link>
        <span>/</span>
        <Link to={`/shop?category=${product.category}`} className="hover:text-black">{product.category}</Link>
        <span>/</span>
        <span className="text-black line-clamp-1">{product.name}</span>
      </nav>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Gallery Section */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex sm:flex-col gap-3 shrink-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-20 sm:w-20 sm:h-24 overflow-hidden rounded-lg border-2 transition-all ${
                    selectedImage === idx ? 'border-[#FF5500]' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img 
                    src={img} 
                    alt="" 
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.pexels.com/photos/1342609/pexels-photo-1342609.jpeg';
                    }}
                    className="w-full h-full object-cover object-top" 
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main Photo */}
          <div className="relative aspect-[3/4] bg-[#EFECE6] flex-1 overflow-hidden rounded-2xl shadow-sm">
            <img
              src={product.images[selectedImage] || product.images[0]}
              alt={product.name}
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.src = 'https://images.pexels.com/photos/1342609/pexels-photo-1342609.jpeg';
              }}
              className="w-full h-full object-cover object-top"
            />
            {product.isNew && (
              <span className="absolute top-4 left-4 bg-black text-white text-[10px] font-bold tracking-widest uppercase px-2.5 py-1">
                New Arrival
              </span>
            )}
          </div>
        </div>

        {/* Product Details Column */}
        <div className="lg:col-span-5 flex flex-col justify-start space-y-6">
          
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF5500]">
              {product.category} • {product.gender || 'Unisex'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-normal uppercase tracking-tight text-black mt-1">
              {product.name}
            </h1>
            <div className="flex items-center gap-3 mt-3 text-xl font-semibold tabular-nums">
              <span>₹{product.price.toLocaleString('en-IN')}</span>
              {product.compareAtPrice && (
                <span className="text-black/40 line-through text-sm font-normal">
                  ₹{product.compareAtPrice.toLocaleString('en-IN')}
                </span>
              )}
              {product.compareAtPrice && (
                <span className="text-xs font-bold text-[#FF5500] uppercase tracking-wider">
                  Save ₹{(product.compareAtPrice - product.price).toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-black/70 leading-relaxed font-light border-y border-black/10 py-4">
            {product.description}
          </p>

          {/* Color Selector */}
          {colors.length > 0 && (
            <div>
              <div className="flex justify-between items-center text-xs uppercase tracking-wider font-semibold mb-2">
                <span>Color: <span className="font-normal text-black/70">{selectedColor}</span></span>
              </div>
              <div className="flex flex-wrap gap-2">
                {colors.map((clr) => (
                  <button
                    key={clr}
                    onClick={() => setSelectedColor(clr)}
                    className={`px-3 py-1.5 text-xs uppercase font-medium tracking-wider border transition-colors ${
                      selectedColor === clr
                        ? 'border-black bg-black text-white'
                        : 'border-black/20 text-black hover:border-black'
                    }`}
                  >
                    {clr}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {sizes.length > 0 && (
            <div>
              <div className="flex justify-between items-center text-xs uppercase tracking-wider font-semibold mb-2">
                <span>Select Size: <span className="font-normal text-black/70">{selectedSize}</span></span>
                <span className="text-[11px] text-black/50 underline cursor-pointer">Size Guide</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((sz) => {
                  const variantForSize = product.variants?.find(
                    v => v.size === sz && v.color === selectedColor
                  );
                  const inStock = variantForSize ? variantForSize.stock > 0 : true;

                  return (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      disabled={!inStock}
                      className={`min-w-11 px-3 py-2 text-xs uppercase font-semibold tracking-wider border transition-colors ${
                        selectedSize === sz
                          ? 'border-[#FF5500] bg-[#FF5500] text-white'
                          : inStock
                          ? 'border-black/20 text-black hover:border-black'
                          : 'border-black/10 text-black/30 line-through cursor-not-allowed bg-black/5'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stock Availability indicator */}
          <div className="text-xs">
            {isOutOfStock ? (
              <span className="text-red-600 font-semibold uppercase tracking-wider">Out of stock in selected variant</span>
            ) : currentVariant && currentVariant.stock < 8 ? (
              <span className="text-[#FF5500] font-medium tracking-wider">
                Only {currentVariant.stock} items remaining in this size
              </span>
            ) : (
              <span className="text-emerald-700 font-medium tracking-wider flex items-center gap-1">
                <Check size={14} /> In Stock & Ready to Dispatch
              </span>
            )}
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-black/20">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-sm hover:bg-black/5"
                >
                  -
                </button>
                <span className="px-4 py-2 text-xs font-semibold tabular-nums">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-sm hover:bg-black/5"
                >
                  +
                </button>
              </div>

              {/* Add to Bag */}
              <button
                onClick={() => handleAddToCart(false)}
                disabled={isOutOfStock || isAdding}
                className="flex-1 py-3 bg-[#FF5500] text-white text-xs uppercase font-bold tracking-widest hover:bg-[#e04b00] disabled:bg-black/20 transition-all flex items-center justify-center gap-2"
              >
                {isAdding ? <Spinner size={16} /> : <ShoppingBag size={16} />}
                <span>{isOutOfStock ? 'Out of Stock' : 'Add to Bag'}</span>
              </button>

              {/* Wishlist toggle */}
              <button
                onClick={() => toggleWishlist(product)}
                className="p-3 border border-black/20 hover:border-black transition-colors"
                title="Save to Wishlist"
              >
                <Heart size={18} className={isWishlisted ? "fill-[#FF5500] text-[#FF5500]" : "text-black"} />
              </button>
            </div>

            {/* Instant Buy Now Button */}
            <button
              onClick={() => handleAddToCart(true)}
              disabled={isOutOfStock || isAdding}
              className="w-full py-3 bg-black text-white text-xs uppercase font-bold tracking-widest hover:bg-black/80 disabled:bg-black/20 transition-all"
            >
              Buy Now with Express Checkout
            </button>
          </div>

          {/* Delivery & Assurance Perks */}
          <div className="space-y-2 pt-4 border-t border-black/10 text-xs text-black/70">
            <div className="flex items-center gap-2">
              <Truck size={15} className="text-[#FF5500]" />
              <span>Complimentary shipping on prepaid and verified orders</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw size={15} className="text-[#FF5500]" />
              <span>7-day door-to-door return and size exchange service</span>
            </div>
          </div>

        </div>

      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-24 pt-12 border-t border-black/10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-light uppercase tracking-tight text-black">
              Pair With & Related Pieces
            </h3>
            <Link to="/shop" className="text-xs uppercase font-semibold tracking-wider hover:text-[#FF5500] flex items-center gap-1">
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map(rel => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, ShoppingBag, Tag, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { 
    cart, updateQuantity, removeFromCart, subtotal, 
    discountAmount, appliedCoupon, applyCoupon, removeCoupon,
    shippingFee, total 
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplying(true);
    await applyCoupon(couponInput.trim());
    setIsApplying(false);
    setCouponInput('');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="inline-flex p-5 rounded-full bg-black/5 text-black/40 mb-4">
          <ShoppingBag size={32} />
        </div>
        <h2 className="text-2xl font-light uppercase tracking-tight text-black mb-2">
          Your Shopping Bag Is Empty
        </h2>
        <p className="text-xs sm:text-sm text-black/60 max-w-sm mx-auto mb-8 font-light">
          Explore the bespoke collections and elevate your wardrobe.
        </p>
        <Link
          to="/shop"
          className="px-8 py-3.5 bg-black text-white text-xs uppercase font-bold tracking-widest hover:bg-[#FF5500] transition-colors"
        >
          Start Exploring
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-light uppercase tracking-tight text-black mb-8 pb-4 border-b border-black/10">
        Shopping Bag ({cart.length})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Cart Item List */}
        <div className="lg:col-span-8 space-y-6">
          {cart.map((item) => (
            <div
              key={item.variantId}
              className="flex gap-4 sm:gap-6 p-4 border border-black/10 bg-white"
            >
              {/* Product Thumbnail */}
              <Link to={`/product/${item.slug}`} className="w-24 h-32 sm:w-28 sm:h-36 bg-[#EFECE6] shrink-0 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover object-center"
                />
              </Link>

              {/* Item Details */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <Link
                      to={`/product/${item.slug}`}
                      className="text-sm font-semibold uppercase tracking-tight text-black hover:text-[#FF5500] transition-colors line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <button
                      onClick={() => removeFromCart(item.variantId)}
                      className="text-black/40 hover:text-red-600 transition-colors p-1"
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <p className="text-xs text-black/60 uppercase tracking-wider mt-1">
                    Size: <span className="font-semibold text-black">{item.selectedSize}</span> • Color: <span className="font-semibold text-black">{item.selectedColor}</span>
                  </p>
                </div>

                {/* Price and Quantity Bar */}
                <div className="flex items-center justify-between pt-4 border-t border-black/5 mt-3">
                  <div className="flex items-center border border-black/20">
                    <button
                      onClick={() => updateQuantity(item.variantId, -1)}
                      className="px-2.5 py-1 text-xs hover:bg-black/5"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="px-3 py-1 text-xs font-semibold tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.variantId, 1)}
                      className="px-2.5 py-1 text-xs hover:bg-black/5"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  <div className="text-sm font-semibold tabular-nums text-black">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center pt-2">
            <Link
              to="/shop"
              className="text-xs uppercase font-semibold tracking-wider text-black/70 hover:text-[#FF5500] transition-colors"
            >
              &larr; Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary Column with Coupon Promo */}
        <div className="lg:col-span-4 space-y-6">
          <div className="border border-black/10 bg-white p-6 space-y-6">
            <h3 className="text-sm uppercase font-bold tracking-widest text-black border-b border-black/10 pb-3">
              Order Summary
            </h3>

            {/* Coupon Code Input */}
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold tracking-wider text-black/70 flex items-center gap-1.5">
                <Tag size={13} className="text-[#FF5500]" />
                <span>Promotional Voucher</span>
              </span>

              {appliedCoupon ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-800 uppercase">
                      {appliedCoupon.code}
                    </span>
                    <p className="text-[11px] text-emerald-600">
                      Savings: ₹{discountAmount.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="p-1 text-emerald-700 hover:text-emerald-900"
                    title="Remove coupon"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Try 'SAPIENS10' or 'VIP20'"
                    className="flex-1 border border-black/20 p-2 text-xs uppercase font-mono tracking-wider focus:outline-none focus:border-[#FF5500]"
                  />
                  <button
                    type="submit"
                    disabled={isApplying}
                    className="px-4 py-2 bg-black text-white text-xs uppercase font-bold tracking-wider hover:bg-[#FF5500] disabled:bg-black/30 transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            <div className="space-y-3 text-xs uppercase tracking-wider text-black/70 pt-2 border-t border-black/10">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-black tabular-nums">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-[#FF5500] font-bold">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span className="tabular-nums">-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-black tabular-nums">
                  {shippingFee === 0 ? 'Free' : `₹${shippingFee}`}
                </span>
              </div>
            </div>

            <div className="border-t border-black/10 pt-4 flex justify-between items-baseline">
              <span className="text-xs uppercase font-bold tracking-widest text-black">Total Due</span>
              <span className="text-xl font-bold tabular-nums text-black">₹{total.toLocaleString('en-IN')}</span>
            </div>

            <Link
              to="/checkout"
              className="w-full py-3.5 bg-[#FF5500] text-white text-xs uppercase font-bold tracking-widest hover:bg-[#e04b00] transition-colors flex items-center justify-center gap-2"
            >
              <span>Proceed To Checkout</span>
              <ArrowRight size={16} />
            </Link>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-black/50 uppercase tracking-wider pt-2">
              <ShieldCheck size={14} className="text-[#FF5500]" />
              <span>Zero-risk checkout & verified orders</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

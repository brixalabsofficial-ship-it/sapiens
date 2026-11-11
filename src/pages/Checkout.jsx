import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { ShieldCheck, Truck, QrCode, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/api';
import { Spinner } from '../components/UIFeedback';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, subtotal, discountAmount, appliedCoupon, shippingFee, total, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: 'Shibli Rahman',
    phone: '9876543210',
    email: 'shibli.rahman@example.com',
    address: '42, Boulevard Heights, Indiranagar 100ft Rd',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    notes: 'Please leave with reception if unavailable'
  });

  const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD' or 'MANUAL_UPI'
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-light uppercase tracking-tight text-black mb-4">
          No items to checkout
        </h2>
        <Link to="/shop" className="px-6 py-2.5 bg-black text-white text-xs uppercase font-bold tracking-widest">
          Go To Catalog
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.address || !formData.city || !formData.pincode) {
      toast.error('Please complete all mandatory delivery fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        items: cart,
        subtotal,
        discountAmount: discountAmount || 0,
        couponCode: appliedCoupon?.code || null,
        shippingFee,
        total,
        paymentMethod,
        notes: formData.notes
      };

      const res = await createOrder(payload);
      
      if (res && res.data) {
        clearCart();
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
        toast.success('Order placed successfully!');
        navigate(`/order-confirmation/${res.data.orderNumber}`, { state: { order: res.data } });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 pb-4 border-b border-black/10">
        <span className="text-xs uppercase tracking-widest text-[#FF5500] font-bold">Checkout</span>
        <h1 className="text-3xl font-light uppercase tracking-tight text-black">
          Delivery & Payment
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Delivery & Payment Form */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Contact & Shipping Details */}
            <div className="bg-white border border-black/10 p-6 space-y-4">
              <h3 className="text-xs uppercase font-bold tracking-widest text-black border-b border-black/10 pb-3">
                1. Delivery Address
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-semibold tracking-wider text-black/70 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-black/20 p-2.5 text-xs text-black focus:outline-none focus:border-[#FF5500]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-semibold tracking-wider text-black/70 mb-1">
                    Phone Number (WhatsApp updates) *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full border border-black/20 p-2.5 text-xs text-black focus:outline-none focus:border-[#FF5500]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold tracking-wider text-black/70 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-black/20 p-2.5 text-xs text-black focus:outline-none focus:border-[#FF5500]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold tracking-wider text-black/70 mb-1">
                  Street Address & Flat / House No *
                </label>
                <textarea
                  name="address"
                  rows={2}
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full border border-black/20 p-2.5 text-xs text-black focus:outline-none focus:border-[#FF5500]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs uppercase font-semibold tracking-wider text-black/70 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full border border-black/20 p-2.5 text-xs text-black focus:outline-none focus:border-[#FF5500]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-semibold tracking-wider text-black/70 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="w-full border border-black/20 p-2.5 text-xs text-black focus:outline-none focus:border-[#FF5500]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-semibold tracking-wider text-black/70 mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    className="w-full border border-black/20 p-2.5 text-xs text-black focus:outline-none focus:border-[#FF5500]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold tracking-wider text-black/70 mb-1">
                  Special Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="e.g. Call before arrival"
                  className="w-full border border-black/20 p-2.5 text-xs text-black focus:outline-none focus:border-[#FF5500]"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-white border border-black/10 p-6 space-y-4">
              <h3 className="text-xs uppercase font-bold tracking-widest text-black border-b border-black/10 pb-3">
                2. Payment Method
              </h3>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label className={`flex items-start gap-4 p-4 border cursor-pointer transition-all ${
                  paymentMethod === 'COD' ? 'border-[#FF5500] bg-black/[0.02]' : 'border-black/10'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="mt-1 accent-[#FF5500]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Truck size={16} className="text-[#FF5500]" />
                      <span className="text-xs uppercase font-bold tracking-wider text-black">
                        Cash On Delivery (COD)
                      </span>
                    </div>
                    <p className="text-xs text-black/60 font-light mt-1">
                      Pay with cash or digital scanner upon delivery at your doorstep.
                    </p>
                  </div>
                </label>

                {/* Manual UPI */}
                <label className={`flex items-start gap-4 p-4 border cursor-pointer transition-all ${
                  paymentMethod === 'MANUAL_UPI' ? 'border-[#FF5500] bg-black/[0.02]' : 'border-black/10'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="MANUAL_UPI"
                    checked={paymentMethod === 'MANUAL_UPI'}
                    onChange={() => setPaymentMethod('MANUAL_UPI')}
                    className="mt-1 accent-[#FF5500]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <QrCode size={16} className="text-[#FF5500]" />
                      <span className="text-xs uppercase font-bold tracking-wider text-black">
                        Direct UPI / GPay / PhonePe (Manual Verification)
                      </span>
                    </div>
                    <p className="text-xs text-black/60 font-light mt-1">
                      Send to Sapiens official UPI ID. Order will be marked awaiting administrator verification.
                    </p>

                    {paymentMethod === 'MANUAL_UPI' && (
                      <div className="mt-3 p-3 bg-black/5 border border-black/10 text-xs space-y-1">
                        <div className="font-semibold text-black">Official UPI ID: <span className="font-mono text-[#FF5500]">sapiens@okhdfcbank</span></div>
                        <div className="text-black/60">After placing your order, send the payment reference number or screenshot on WhatsApp to +91 98765 43210.</div>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* Checkout Bag Summary */}
          <div className="lg:col-span-5">
            <div className="border border-black/10 bg-white p-6 space-y-6 sticky top-28">
              <h3 className="text-xs uppercase font-bold tracking-widest text-black border-b border-black/10 pb-3">
                Review Bag ({cart.length})
              </h3>

              <div className="max-h-72 overflow-y-auto space-y-3 pr-2">
                {cart.map((item) => (
                  <div key={item.variantId} className="flex items-center gap-3 py-2 border-b border-black/5">
                    <img src={item.image} alt="" className="w-12 h-14 object-cover bg-black/5 shrink-0" />
                    <div className="flex-1 text-xs">
                      <p className="font-semibold text-black line-clamp-1">{item.name}</p>
                      <p className="text-black/50">{item.selectedSize} / {item.selectedColor} × {item.quantity}</p>
                    </div>
                    <span className="text-xs font-semibold tabular-nums">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-xs uppercase tracking-wider text-black/70 pt-2 border-t border-black/10">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-black tabular-nums">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#FF5500] font-bold">
                    <span>Coupon ({appliedCoupon?.code})</span>
                    <span className="tabular-nums">-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="font-semibold text-black tabular-nums">
                    {shippingFee === 0 ? 'Complimentary' : `₹${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-black pt-3 border-t border-black/10">
                  <span>Total Amount Due</span>
                  <span className="text-lg tabular-nums text-black">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#FF5500] text-white text-xs uppercase font-bold tracking-widest hover:bg-[#e04b00] disabled:bg-black/20 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Spinner size={16} /> : <CheckCircle2 size={16} />}
                <span>{isSubmitting ? 'Confirming Order...' : 'Confirm & Place Order'}</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-black/50 uppercase tracking-wider text-center">
                <ShieldCheck size={14} className="text-[#FF5500]" />
                <span>Protected server-side pricing & SSL verification</span>
              </div>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}

import React from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { CheckCircle2, PackageCheck, Clock, ArrowRight, Phone } from 'lucide-react';

export default function OrderConfirmation() {
  const { orderNumber } = useParams();
  const location = useLocation();
  const order = location.state?.order;

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-8">
      
      {/* Success Badge */}
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FF5500]/10 text-[#FF5500]">
        <CheckCircle2 size={36} />
      </div>

      <div>
        <span className="text-xs uppercase tracking-widest font-mono text-[#FF5500]">Order Placed Successfully</span>
        <h1 className="text-3xl sm:text-4xl font-light uppercase tracking-tight text-black mt-1">
          Thank You For Choosing Sapiens
        </h1>
        <p className="text-xs sm:text-sm text-black/60 font-light mt-2">
          Your order number is <span className="font-mono font-bold text-black">{orderNumber}</span>. We have logged your delivery request and are preparing dispatch.
        </p>
      </div>

      {/* Order Status Box */}
      <div className="bg-white border border-black/10 p-6 sm:p-8 text-left space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10 pb-4">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-black/50">Current Status</span>
            <div className="flex items-center gap-2 mt-0.5">
              <Clock size={16} className="text-[#FF5500]" />
              <span className="text-xs uppercase font-bold tracking-wider text-black">
                {order?.orderStatus || 'Pending Confirmation'}
              </span>
            </div>
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-wider text-black/50">Payment Status</span>
            <div className="text-xs uppercase font-bold tracking-wider text-black mt-0.5">
              {order?.paymentStatus === 'AWAITING_VERIFICATION' ? (
                <span className="text-[#FF5500]">Awaiting Admin Verification (UPI)</span>
              ) : (
                <span>Cash on Delivery (Pending Delivery)</span>
              )}
            </div>
          </div>
        </div>

        {/* Manual UPI Instructions */}
        {order?.paymentMethod === 'MANUAL_UPI' && (
          <div className="p-4 bg-orange-50 border border-orange-200 text-xs space-y-2">
            <h4 className="font-bold text-[#FF5500] uppercase tracking-wider">Manual UPI Verification Step</h4>
            <p className="text-black/80 font-light leading-relaxed">
              Please transfer <span className="font-bold">₹{order.total?.toLocaleString('en-IN')}</span> to <span className="font-mono font-bold">sapiens@okhdfcbank</span> and share your transaction ID with your order number #{orderNumber} via WhatsApp.
            </p>
            <a
              href={`https://wa.me/919876543210?text=Hi%20Sapiens%2C%20here%20is%20my%20UPI%20payment%20reference%20for%20Order%20${orderNumber}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-black text-white uppercase text-[11px] font-bold tracking-wider hover:bg-[#FF5500] transition-colors"
            >
              <Phone size={12} />
              <span>Verify on WhatsApp</span>
            </a>
          </div>
        )}

        {/* Quick summary */}
        {order?.items && (
          <div>
            <h4 className="text-xs uppercase font-bold tracking-widest text-black mb-3">Items Ordered</h4>
            <div className="divide-y divide-black/5">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-2.5 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-semibold text-black">{item.name}</span>
                    <span className="text-black/50 ml-2">({item.variant}) × {item.quantity}</span>
                  </div>
                  <span className="font-semibold tabular-nums">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4 pt-4">
        <Link
          to={`/order-tracking?id=${orderNumber}`}
          className="px-6 py-3 border border-black text-black text-xs uppercase font-bold tracking-widest hover:bg-black hover:text-white transition-colors"
        >
          Track This Order
        </Link>
        <Link
          to="/shop"
          className="px-6 py-3 bg-[#FF5500] text-white text-xs uppercase font-bold tracking-widest hover:bg-[#e04b00] transition-colors"
        >
          Continue Shopping
        </Link>
      </div>

    </div>
  );
}

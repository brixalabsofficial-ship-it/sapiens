import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Package, CheckCircle2, Clock, Truck, MapPin } from 'lucide-react';
import { fetchOrder } from '../services/api';
import { Spinner } from '../components/UIFeedback';

export default function OrderTracking() {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const [orderQuery, setOrderQuery] = useState(initialId);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialId) {
      handleLookup(initialId);
    }
  }, [initialId]);

  const handleLookup = async (idToLook) => {
    const q = idToLook || orderQuery;
    if (!q.trim()) return;

    setLoading(true);
    setError('');
    try {
      const res = await fetchOrder(q.trim());
      if (res && res.data) {
        setOrder(res.data);
      } else {
        setError('No order found matching this reference.');
      }
    } catch {
      setError('Order not found. Please verify your reference number.');
    } finally {
      setLoading(false);
    }
  };

  const getTimelineStep = (status) => {
    const steps = ['PENDING_CONFIRMATION', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
    return steps.indexOf(status) >= 0 ? steps.indexOf(status) : 0;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <span className="text-xs uppercase tracking-widest text-[#FF5500] font-bold">Client Support</span>
        <h1 className="text-3xl font-light uppercase tracking-tight text-black mt-1">
          Track Your Consignment
        </h1>
        <p className="text-xs sm:text-sm text-black/60 font-light mt-2">
          Enter your order number (e.g. SP-2026-9041) to inspect live status & delivery logs.
        </p>
      </div>

      {/* Search Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLookup();
        }}
        className="flex gap-2 max-w-lg mx-auto mb-10"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={orderQuery}
            onChange={(e) => setOrderQuery(e.target.value)}
            placeholder="Enter Order ID (e.g. SP-2026-9041)"
            className="w-full border border-black/20 px-4 py-3 text-xs uppercase tracking-wider focus:outline-none focus:border-[#FF5500] font-mono bg-white"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-[#FF5500] text-white text-xs uppercase font-bold tracking-widest hover:bg-[#e04b00] disabled:bg-black/20 transition-colors flex items-center gap-2"
        >
          {loading ? <Spinner size={14} /> : <Search size={14} />}
          <span>Lookup</span>
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 text-xs font-semibold text-center border border-red-200 uppercase tracking-wider">
          {error}
        </div>
      )}

      {order && (
        <div className="bg-white border border-black/10 p-6 sm:p-8 space-y-8 animate-fadeIn">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10 pb-6">
            <div>
              <span className="text-xs text-black/50 uppercase tracking-wider">Order Reference</span>
              <h2 className="text-xl font-bold font-mono text-black">{order.orderNumber}</h2>
            </div>
            <div className="text-right sm:text-right">
              <span className="text-xs text-black/50 uppercase tracking-wider">Order Status</span>
              <div className="text-xs font-bold uppercase tracking-widest text-[#FF5500] mt-0.5">
                {order.orderStatus.replace('_', ' ')}
              </div>
            </div>
          </div>

          {/* Timeline Visualizer */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase font-bold tracking-widest text-black">
              Consignment Progress
            </h3>

            <div className="grid grid-cols-4 gap-2 text-center text-[10px] sm:text-xs uppercase font-semibold tracking-wider">
              {['Order Received', 'Confirmed', 'Dispatched', 'Delivered'].map((step, idx) => {
                const currentStepIdx = getTimelineStep(order.orderStatus);
                const isPassed = currentStepIdx >= idx;

                return (
                  <div key={step} className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 border-2 transition-colors ${
                        isPassed
                          ? 'bg-[#FF5500] border-[#FF5500] text-white'
                          : 'bg-white border-black/20 text-black/40'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <span className={isPassed ? 'text-black' : 'text-black/40'}>{step}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Courier & Tracking Details */}
          <div className="p-4 bg-black/5 border border-black/10 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-black/60 uppercase tracking-wider">Logistics Partner:</span>
              <span className="font-semibold text-black">BlueDart Express / Delhivery Air</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black/60 uppercase tracking-wider">Tracking AWB / Reference:</span>
              <span className="font-mono font-bold text-black">{order.trackingNumber || 'Assigned at dispatch'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black/60 uppercase tracking-wider">Payment Status:</span>
              <span className="font-semibold text-[#FF5500] uppercase tracking-wider">
                {order.paymentStatus}
              </span>
            </div>
          </div>

          {/* Delivery Address */}
          {order.shippingAddress && (
            <div className="text-xs space-y-1">
              <span className="text-black/50 uppercase tracking-wider block">Destination Address:</span>
              <p className="font-medium text-black">{order.shippingAddress.address}</p>
              <p className="text-black/70">
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

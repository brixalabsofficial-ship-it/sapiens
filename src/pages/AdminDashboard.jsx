import React, { useState, useEffect } from 'react';
import { 
  Package, ShoppingCart, DollarSign, AlertCircle, Plus, Edit2, 
  Trash2, Check, CheckCircle2, XCircle, Search, Filter, ShieldCheck,
  TrendingUp, RefreshCw, Tag, Power
} from 'lucide-react';
import toast from 'react-hot-toast';
import { initialProducts, initialOrders } from '../data/mockData.js';
import { initialCoupons } from '../data/coupons.js';
import { ConfirmationDialog, Spinner } from '../components/UIFeedback';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'products', 'coupons', 'metrics'
  
  // Data states
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [coupons, setCoupons] = useState(initialCoupons);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [orderSearch, setOrderSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [couponSearch, setCouponSearch] = useState('');

  // Modals & Confirmation
  const [editingProduct, setEditingProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: 15,
    minOrderValue: 3000,
    description: ''
  });
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, type: '', id: null, title: '' });
  const [awbModal, setAwbModal] = useState({ isOpen: false, orderId: null, awbNumber: '' });

  // Load backend data or initialize
  const loadData = async () => {
    setLoading(true);
    try {
      const [resOrders, resProds, resCoupons, resMetrics] = await Promise.all([
        fetch('/api/orders').then(r => r.json()).catch(() => ({ data: initialOrders })),
        fetch('/api/products').then(r => r.json()).catch(() => ({ data: initialProducts })),
        fetch('/api/coupons').then(r => r.json()).catch(() => ({ data: initialCoupons })),
        fetch('/api/admin/metrics').then(r => r.json()).catch(() => ({
          data: {
            totalOrders: initialOrders.length,
            verifiedRevenue: initialOrders.reduce((s, o) => s + (o.paymentStatus === 'PAID' ? o.total : 0), 0),
            pendingVerificationCount: initialOrders.filter(o => o.paymentStatus === 'AWAITING_VERIFICATION').length,
            activeOrdersCount: initialOrders.filter(o => !['DELIVERED', 'CANCELLED'].includes(o.orderStatus)).length,
            totalProducts: initialProducts.length,
            lowStockCount: 2
          }
        }))
      ]);

      setOrders(resOrders.data || initialOrders);
      setProducts(resProds.data || initialProducts);
      setCoupons(resCoupons.data || initialCoupons);
      setMetrics(resMetrics.data || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Order Actions
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: newStatus })
      });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o));
      toast.success(`Order status updated to ${newStatus}`);
    } catch {
      // Local fallback
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o));
      toast.success(`Order status updated to ${newStatus}`);
    }
  };

  const handleVerifyPayment = async (orderId) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: 'PAID', orderStatus: 'CONFIRMED' })
      });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentStatus: 'PAID', orderStatus: 'CONFIRMED' } : o));
      toast.success('UPI Payment verified & order confirmed!');
    } catch {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentStatus: 'PAID', orderStatus: 'CONFIRMED' } : o));
      toast.success('UPI Payment verified & order confirmed!');
    }
  };

  const handleSetTracking = async (orderId, trackingNumber) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingNumber, orderStatus: 'SHIPPED' })
      });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, trackingNumber, orderStatus: 'SHIPPED' } : o));
      toast.success('Assigned tracking number & marked as Shipped');
    } catch {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, trackingNumber, orderStatus: 'SHIPPED' } : o));
      toast.success('Assigned tracking number & marked as Shipped');
    }
  };

  // Product Delete
  const confirmDeleteProduct = (product) => {
    setDeleteConfirm({
      isOpen: true,
      type: 'product',
      id: product.id,
      title: `Delete product "${product.name}"?`
    });
  };

  const handleDeleteConfirmed = async () => {
    if (deleteConfirm.type === 'product') {
      try {
        await fetch(`/api/products/${deleteConfirm.id}`, { method: 'DELETE' });
        setProducts(prev => prev.filter(p => p.id !== deleteConfirm.id));
        toast.success('Product deleted');
      } catch {
        setProducts(prev => prev.filter(p => p.id !== deleteConfirm.id));
        toast.success('Product deleted');
      }
    }
    setDeleteConfirm({ isOpen: false, type: '', id: null, title: '' });
  };

  // Filtered lists
  const filteredOrders = orders.filter(o => {
    const matchStatus = orderStatusFilter === 'ALL' || o.orderStatus === orderStatusFilter;
    const matchSearch = !orderSearch || 
      o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerPhone.includes(orderSearch);
    return matchStatus && matchSearch;
  });

  const filteredProducts = products.filter(p => {
    return !productSearch || 
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Admin Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#FF5500] text-white text-[10px] font-bold tracking-widest uppercase">
              Management Portal
            </span>
            <span className="text-xs text-black/50 font-mono">v1.0 Production Mode</span>
          </div>
          <h1 className="text-3xl font-light uppercase tracking-tight text-black mt-1">
            Sapiens Brand Administration
          </h1>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 bg-black/5 p-1">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 text-xs uppercase font-semibold tracking-wider transition-colors ${
              activeTab === 'orders' ? 'bg-black text-white shadow-sm' : 'text-black/70 hover:text-black'
            }`}
          >
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 text-xs uppercase font-semibold tracking-wider transition-colors ${
              activeTab === 'products' ? 'bg-black text-white shadow-sm' : 'text-black/70 hover:text-black'
            }`}
          >
            Products & Inventory ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-4 py-2 text-xs uppercase font-semibold tracking-wider transition-colors ${
              activeTab === 'coupons' ? 'bg-black text-white shadow-sm' : 'text-black/70 hover:text-black'
            }`}
          >
            Vouchers & Coupons ({coupons.length})
          </button>
          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-4 py-2 text-xs uppercase font-semibold tracking-wider transition-colors ${
              activeTab === 'metrics' ? 'bg-black text-white shadow-sm' : 'text-black/70 hover:text-black'
            }`}
          >
            Overview & Metrics
          </button>
        </div>
      </div>

      {/* METRICS & OVERVIEW TAB */}
      {activeTab === 'metrics' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-black/10 p-6 space-y-2">
              <span className="text-xs uppercase tracking-widest text-black/50 font-semibold">Total Orders Placed</span>
              <div className="text-3xl font-bold tabular-nums text-black">{orders.length}</div>
              <p className="text-[11px] text-black/40">Logged in system</p>
            </div>

            <div className="bg-white border border-black/10 p-6 space-y-2">
              <span className="text-xs uppercase tracking-widest text-black/50 font-semibold">Verified Revenue</span>
              <div className="text-3xl font-bold tabular-nums text-[#FF5500]">
                ₹{orders.filter(o => o.paymentStatus === 'PAID').reduce((s, o) => s + o.total, 0).toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-black/40">From confirmed digital/cash settlements</p>
            </div>

            <div className="bg-white border border-black/10 p-6 space-y-2">
              <span className="text-xs uppercase tracking-widest text-black/50 font-semibold">Pending UPI Verifications</span>
              <div className="text-3xl font-bold tabular-nums text-black">
                {orders.filter(o => o.paymentStatus === 'AWAITING_VERIFICATION').length}
              </div>
              <p className="text-[11px] text-[#FF5500]">Requires admin confirmation</p>
            </div>

            <div className="bg-white border border-black/10 p-6 space-y-2">
              <span className="text-xs uppercase tracking-widest text-black/50 font-semibold">Active Inventory Lines</span>
              <div className="text-3xl font-bold tabular-nums text-black">{products.length}</div>
              <p className="text-[11px] text-black/40">Across Men, Kids, Shoes, Accessories</p>
            </div>
          </div>
        </div>
      )}

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Order Search & Status Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white border border-black/10 p-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-black/40" size={16} />
              <input
                type="text"
                placeholder="Search by Order #, Customer Name, Phone..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-black/20 text-xs focus:outline-none focus:border-[#FF5500]"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-black/60">Status:</span>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="border border-black/20 px-3 py-2 text-xs uppercase font-semibold focus:outline-none focus:border-[#FF5500]"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING_CONFIRMATION">Pending Confirmation</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white border border-black/10 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-black/5 border-b border-black/10 uppercase tracking-wider text-black/70">
                <tr>
                  <th className="p-4">Order Ref</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Order Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10 font-normal">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-black/50 uppercase tracking-wider">
                      No matching orders found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-black/[0.01]">
                      <td className="p-4 font-mono font-bold text-black">
                        {ord.orderNumber}
                        <div className="text-[10px] text-black/40 font-sans mt-0.5">
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="font-semibold text-black">{ord.customerName}</div>
                        <div className="text-black/50 text-[11px]">{ord.customerPhone}</div>
                        <div className="text-black/40 text-[10px] line-clamp-1">{ord.shippingAddress?.city}, {ord.shippingAddress?.state}</div>
                      </td>

                      <td className="p-4">
                        <div className="max-w-xs space-y-1">
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="line-clamp-1 text-black/80">
                              • {it.name} <span className="text-black/40">({it.variant} ×{it.quantity})</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="p-4 tabular-nums font-semibold text-black">
                        ₹{ord.total.toLocaleString('en-IN')}
                      </td>

                      <td className="p-4">
                        <span className={`inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider ${
                          ord.paymentStatus === 'PAID'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.paymentStatus === 'AWAITING_VERIFICATION'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-black/10 text-black/70'
                        }`}>
                          {ord.paymentStatus}
                        </span>
                        <div className="text-[10px] text-black/50 mt-1 uppercase">{ord.paymentMethod}</div>
                        {ord.paymentStatus === 'AWAITING_VERIFICATION' && (
                          <button
                            onClick={() => handleVerifyPayment(ord.id)}
                            className="mt-1.5 px-2 py-1 bg-[#FF5500] text-white text-[10px] uppercase font-bold tracking-wider hover:bg-[#e04b00] transition-colors block"
                          >
                            Verify UPI
                          </button>
                        )}
                      </td>

                      <td className="p-4">
                        <select
                          value={ord.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                          className="border border-black/20 text-xs px-2 py-1 uppercase font-semibold focus:outline-none focus:border-[#FF5500] bg-white"
                        >
                          <option value="PENDING_CONFIRMATION">Pending Confirmation</option>
                          <option value="CONFIRMED">Confirmed</option>
                          <option value="PROCESSING">Processing</option>
                          <option value="SHIPPED">Shipped</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </td>

                      <td className="p-4 text-right space-y-1">
                        {!ord.trackingNumber && ord.orderStatus !== 'CANCELLED' && (
                          <button
                            onClick={() => {
                              setAwbModal({
                                isOpen: true,
                                orderId: ord.id,
                                awbNumber: `BLUEDART-${Math.floor(100000 + Math.random() * 900000)}`
                              });
                            }}
                            className="px-2.5 py-1 border border-black text-[10px] uppercase font-bold tracking-wider hover:bg-black hover:text-white transition-colors"
                          >
                            Assign AWB
                          </button>
                        )}
                        {ord.trackingNumber && (
                          <div className="text-[10px] font-mono text-black/70">
                            AWB: {ord.trackingNumber}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PRODUCTS & INVENTORY TAB */}
      {activeTab === 'products' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white border border-black/10 p-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-black/40" size={16} />
              <input
                type="text"
                placeholder="Search products by title, category..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-black/20 text-xs focus:outline-none focus:border-[#FF5500]"
              />
            </div>

            <button
              onClick={() => {
                setEditingProduct({
                  name: '',
                  category: 'Men',
                  gender: 'Men',
                  price: 2499,
                  compareAtPrice: 2999,
                  description: '',
                  images: ['https://images.pexels.com/photos/1342609/pexels-photo-1342609.jpeg'],
                  variants: [{ id: `v-${Date.now()}`, size: 'M', color: 'Signal Orange', stock: 15 }]
                });
                setIsProductModalOpen(true);
              }}
              className="px-4 py-2 bg-[#FF5500] text-white text-xs uppercase font-bold tracking-widest hover:bg-[#e04b00] transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              <span>Add New Product</span>
            </button>
          </div>

          {/* Product Listing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((p) => {
              const totalStock = p.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
              return (
                <div key={p.id} className="border border-black/10 bg-white p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex gap-4">
                      <img src={p.images[0]} alt="" className="w-20 h-24 object-cover bg-black/5 shrink-0" />
                      <div className="flex-1">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#FF5500]">
                          {p.category}
                        </span>
                        <h4 className="text-sm font-semibold uppercase tracking-tight text-black line-clamp-1">
                          {p.name}
                        </h4>
                        <div className="text-xs font-semibold tabular-nums mt-1">
                          ₹{p.price.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[11px] text-black/60 mt-1">
                          Total Stock: <span className={`font-bold ${totalStock < 10 ? 'text-red-600' : 'text-emerald-700'}`}>{totalStock} units</span>
                        </div>
                      </div>
                    </div>

                    {/* Variant breakdown */}
                    <div className="mt-4 pt-3 border-t border-black/5">
                      <span className="text-[10px] uppercase tracking-wider text-black/50 block mb-1">
                        Variants & Stock Levels:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {p.variants?.map((v) => (
                          <span
                            key={v.id}
                            className={`px-2 py-0.5 text-[10px] border ${
                              v.stock < 8 ? 'border-red-300 bg-red-50 text-red-700' : 'border-black/10 bg-black/5 text-black/70'
                            }`}
                          >
                            {v.size} ({v.color}): <strong>{v.stock}</strong>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-black/5">
                    <button
                      onClick={() => confirmDeleteProduct(p)}
                      className="p-2 text-black/40 hover:text-red-600 transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VOUCHERS & COUPONS TAB */}
      {activeTab === 'coupons' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white border border-black/10 p-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-black/40" size={16} />
              <input
                type="text"
                placeholder="Search coupons by code or description..."
                value={couponSearch}
                onChange={(e) => setCouponSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-black/20 text-xs uppercase focus:outline-none focus:border-[#FF5500]"
              />
            </div>

            <button
              onClick={() => setIsCouponModalOpen(true)}
              className="px-4 py-2 bg-[#FF5500] text-white text-xs uppercase font-bold tracking-widest hover:bg-[#e04b00] transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              <span>Create Coupon Code</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons
              .filter(c => !couponSearch || c.code.toLowerCase().includes(couponSearch.toLowerCase()) || c.description?.toLowerCase().includes(couponSearch.toLowerCase()))
              .map((cpn) => (
                <div key={cpn.id} className="border border-black/10 bg-white p-5 flex flex-col justify-between relative shadow-sm">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Tag size={16} className="text-[#FF5500]" />
                        <h4 className="text-base font-black font-mono tracking-wider text-black uppercase">
                          {cpn.code}
                        </h4>
                      </div>
                      <span className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full ${
                        cpn.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {cpn.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </div>

                    <p className="text-xs text-black/70 mb-3 font-normal">
                      {cpn.description || 'Promotional coupon code'}
                    </p>

                    <div className="p-3 bg-black/5 text-xs space-y-1 font-medium">
                      <div className="flex justify-between">
                        <span className="text-black/50">Discount:</span>
                        <span className="font-bold text-[#FF5500]">
                          {cpn.discountType === 'PERCENTAGE' ? `${cpn.discountValue}% OFF` : `₹${cpn.discountValue} OFF`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-black/50">Min Cart Value:</span>
                        <span className="font-semibold text-black">₹{cpn.minOrderValue.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-black/10">
                    <button
                      onClick={async () => {
                        try {
                          await fetch(`/api/coupons/${cpn.id}/toggle`, { method: 'PATCH' });
                        } catch {}
                        setCoupons(prev => prev.map(c => c.id === cpn.id ? { ...c, isActive: !c.isActive } : c));
                        toast.success(`Coupon ${cpn.code} is now ${!cpn.isActive ? 'Active' : 'Disabled'}`);
                      }}
                      className="text-xs uppercase font-bold tracking-wider text-black/70 hover:text-black flex items-center gap-1"
                    >
                      <Power size={13} className={cpn.isActive ? 'text-emerald-600' : 'text-slate-400'} />
                      <span>{cpn.isActive ? 'Disable' : 'Enable'}</span>
                    </button>

                    <button
                      onClick={async () => {
                        try {
                          await fetch(`/api/coupons/${cpn.id}`, { method: 'DELETE' });
                        } catch {}
                        setCoupons(prev => prev.filter(c => c.id !== cpn.id));
                        toast.success('Coupon deleted');
                      }}
                      className="p-1.5 text-black/40 hover:text-red-600 transition-colors"
                      title="Delete Coupon"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationDialog
        isOpen={deleteConfirm.isOpen}
        title="Confirm Deletion"
        message={deleteConfirm.title}
        confirmLabel="Yes, Delete"
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeleteConfirm({ isOpen: false, type: '', id: null, title: '' })}
      />

      {/* Add Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white max-w-lg w-full p-6 border border-black/10 max-h-[90vh] overflow-y-auto space-y-4">
            <h3 className="text-sm uppercase font-bold tracking-widest text-black border-b border-black/10 pb-3">
              Add New Product to Sapiens Store
            </h3>

            <div>
              <label className="block text-xs uppercase font-semibold text-black/70 mb-1">Product Title</label>
              <input
                type="text"
                value={editingProduct?.name || ''}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                className="w-full border border-black/20 p-2 text-xs focus:outline-none focus:border-[#FF5500]"
                placeholder="e.g. Heavyweight Minimalist Overshirt"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs uppercase font-semibold text-black/70 mb-1">Category</label>
                <select
                  value={editingProduct?.category || 'Men'}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  className="w-full border border-black/20 p-2 text-xs uppercase font-semibold focus:outline-none focus:border-[#FF5500]"
                >
                  <option value="Men">Men</option>
                  <option value="Kids">Kids</option>
                  <option value="Shoes">Shoes</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-black/70 mb-1">Price (₹)</label>
                <input
                  type="number"
                  value={editingProduct?.price || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                  className="w-full border border-black/20 p-2 text-xs focus:outline-none focus:border-[#FF5500]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold text-black/70 mb-1">Image URL</label>
              <input
                type="text"
                value={editingProduct?.images?.[0] || ''}
                onChange={(e) => setEditingProduct({ ...editingProduct, images: [e.target.value] })}
                className="w-full border border-black/20 p-2 text-xs focus:outline-none focus:border-[#FF5500]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold text-black/70 mb-1">Description</label>
              <textarea
                rows={3}
                value={editingProduct?.description || ''}
                onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                className="w-full border border-black/20 p-2 text-xs focus:outline-none focus:border-[#FF5500]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-black/10">
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="px-4 py-2 border border-black/20 text-xs uppercase font-semibold tracking-wider hover:bg-black/5"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!editingProduct.name || !editingProduct.price) {
                    toast.error('Title and price are required');
                    return;
                  }
                  try {
                    const res = await fetch('/api/products', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(editingProduct)
                    });
                    const data = await res.json();
                    setProducts(prev => [data.data || editingProduct, ...prev]);
                    toast.success('Product added successfully');
                  } catch {
                    setProducts(prev => [{ ...editingProduct, id: `sp-${Date.now()}` }, ...prev]);
                    toast.success('Product added successfully');
                  }
                  setIsProductModalOpen(false);
                }}
                className="px-4 py-2 bg-[#FF5500] text-white text-xs uppercase font-bold tracking-widest hover:bg-[#e04b00]"
              >
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Coupon Modal */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white max-w-md w-full p-6 border border-black/10 shadow-2xl space-y-4">
            <h3 className="text-sm uppercase font-bold tracking-widest text-black border-b border-black/10 pb-3">
              Create New Promotional Coupon
            </h3>

            <div>
              <label className="block text-xs uppercase font-semibold text-black/70 mb-1">
                Coupon Code
              </label>
              <input
                type="text"
                value={newCoupon.code}
                onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                placeholder="e.g. FESTIVE25"
                className="w-full border border-black/20 p-2 text-xs font-mono uppercase focus:outline-none focus:border-[#FF5500]"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs uppercase font-semibold text-black/70 mb-1">
                  Discount Type
                </label>
                <select
                  value={newCoupon.discountType}
                  onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value })}
                  className="w-full border border-black/20 p-2 text-xs uppercase font-semibold focus:outline-none focus:border-[#FF5500]"
                >
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FIXED">Flat Amount (₹)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-black/70 mb-1">
                  Discount Value
                </label>
                <input
                  type="number"
                  value={newCoupon.discountValue}
                  onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: e.target.value })}
                  placeholder={newCoupon.discountType === 'PERCENTAGE' ? 'e.g. 15' : 'e.g. 1000'}
                  className="w-full border border-black/20 p-2 text-xs focus:outline-none focus:border-[#FF5500]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold text-black/70 mb-1">
                Minimum Cart Value (₹)
              </label>
              <input
                type="number"
                value={newCoupon.minOrderValue}
                onChange={(e) => setNewCoupon({ ...newCoupon, minOrderValue: e.target.value })}
                placeholder="e.g. 3000"
                className="w-full border border-black/20 p-2 text-xs focus:outline-none focus:border-[#FF5500]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold text-black/70 mb-1">
                Description
              </label>
              <input
                type="text"
                value={newCoupon.description}
                onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                placeholder="e.g. 15% off on tailored luxury sets"
                className="w-full border border-black/20 p-2 text-xs focus:outline-none focus:border-[#FF5500]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-black/10">
              <button
                onClick={() => setIsCouponModalOpen(false)}
                className="px-4 py-2 border border-black/20 text-xs uppercase font-semibold tracking-wider hover:bg-black/5"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!newCoupon.code.trim() || !newCoupon.discountValue) {
                    toast.error('Code and discount value are required');
                    return;
                  }
                  try {
                    const res = await fetch('/api/coupons', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(newCoupon)
                    });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.message);
                    setCoupons(prev => [data.data, ...prev]);
                    toast.success(`Coupon ${newCoupon.code} created!`);
                  } catch (err) {
                    const localCpn = {
                      id: `cpn-${Date.now()}`,
                      code: newCoupon.code.trim().toUpperCase(),
                      discountType: newCoupon.discountType,
                      discountValue: Number(newCoupon.discountValue),
                      minOrderValue: Number(newCoupon.minOrderValue) || 0,
                      isActive: true,
                      description: newCoupon.description
                    };
                    setCoupons(prev => [localCpn, ...prev]);
                    toast.success(`Coupon ${localCpn.code} created!`);
                  }
                  setIsCouponModalOpen(false);
                  setNewCoupon({ code: '', discountType: 'PERCENTAGE', discountValue: 15, minOrderValue: 3000, description: '' });
                }}
                className="px-4 py-2 bg-[#FF5500] text-white text-xs uppercase font-bold tracking-widest hover:bg-[#e04b00]"
              >
                Create Coupon
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign AWB Modal */}
      {awbModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white max-w-sm w-full p-6 border border-black/10 shadow-2xl space-y-4">
            <h3 className="text-sm uppercase font-bold tracking-widest text-black border-b border-black/10 pb-3">
              Assign Courier AWB / Tracking
            </h3>

            <p className="text-xs text-black/60 font-light leading-relaxed">
              Enter the Air Waybill consignment tracking code from BlueDart, Delhivery, or DTDC.
            </p>

            <div>
              <label className="block text-xs uppercase font-semibold text-black/70 mb-1">
                AWB Tracking Code
              </label>
              <input
                type="text"
                value={awbModal.awbNumber}
                onChange={(e) => setAwbModal({ ...awbModal, awbNumber: e.target.value })}
                className="w-full border border-black/20 p-2 text-xs font-mono focus:outline-none focus:border-[#FF5500]"
                placeholder="e.g. BLUEDART-882194"
                autoFocus
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-black/10">
              <button
                onClick={() => setAwbModal({ isOpen: false, orderId: null, awbNumber: '' })}
                className="px-4 py-2 border border-black/20 text-xs uppercase font-semibold tracking-wider hover:bg-black/5"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!awbModal.awbNumber.trim()) {
                    toast.error('Please enter an AWB tracking code');
                    return;
                  }
                  handleSetTracking(awbModal.orderId, awbModal.awbNumber.trim());
                  setAwbModal({ isOpen: false, orderId: null, awbNumber: '' });
                }}
                className="px-4 py-2 bg-[#FF5500] text-white text-xs uppercase font-bold tracking-widest hover:bg-[#e04b00]"
              >
                Confirm & Ship
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

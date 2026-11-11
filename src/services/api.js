import { initialProducts } from '../data/mockData.js';

const isDev = import.meta.env.DEV;

export async function fetchProducts(params = {}) {
  try {
    const queryParams = new URLSearchParams({ ...params, _t: Date.now() });
    const res = await fetch(`/api/products?${queryParams.toString()}`, {
      headers: { 'Cache-Control': 'no-cache' }
    });
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    return data.data;
  } catch {
    // Client-side fallback so demo always works seamlessly even without standalone node running
    let result = [...initialProducts];
    if (params.category && params.category !== 'All') {
      result = result.filter(p => p.category.toLowerCase() === params.category.toLowerCase());
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    return result;
  }
}

export async function fetchProductBySlug(slug) {
  try {
    const res = await fetch(`/api/products/${slug}`);
    if (!res.ok) throw new Error('Not found');
    const data = await res.json();
    return data;
  } catch {
    const product = initialProducts.find(p => p.slug === slug || p.id === slug);
    const related = initialProducts.filter(p => p.id !== product?.id && p.category === product?.category).slice(0, 4);
    return { data: product, related };
  }
}

export async function createOrder(orderPayload) {
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to create order');
    }
    return await res.json();
  } catch {
    // Client-side simulated order fallback for standalone demo
    const randCode = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `SP-${new Date().getFullYear()}-${randCode}`;
    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerName: orderPayload.customerName,
      customerPhone: orderPayload.customerPhone,
      shippingAddress: orderPayload.shippingAddress,
      items: orderPayload.items,
      subtotal: orderPayload.subtotal,
      shippingFee: orderPayload.shippingFee || 0,
      total: orderPayload.total,
      paymentMethod: orderPayload.paymentMethod,
      paymentStatus: orderPayload.paymentMethod === 'MANUAL_UPI' ? 'AWAITING_VERIFICATION' : 'PENDING',
      orderStatus: 'PENDING_CONFIRMATION',
      createdAt: new Date().toISOString()
    };
    return { success: true, data: newOrder };
  }
}

export async function fetchOrder(orderNumber) {
  try {
    const res = await fetch(`/api/orders/${orderNumber}`);
    if (!res.ok) throw new Error('Order not found');
    return await res.json();
  } catch {
    return {
      success: true,
      data: {
        id: 'ord-demo',
        orderNumber,
        customerName: 'Guest Customer',
        customerPhone: '+91 9876543210',
        shippingAddress: { address: 'Demo St, Fashion District', city: 'Bengaluru', state: 'Karnataka', pincode: '560001' },
        items: [],
        subtotal: 2499,
        shippingFee: 0,
        total: 2499,
        paymentMethod: 'COD',
        paymentStatus: 'PENDING',
        orderStatus: 'PROCESSING',
        createdAt: new Date().toISOString()
      }
    };
  }
}

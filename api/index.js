import express from 'express';
import cors from 'cors';
import { initialProducts, initialOrders } from './mockData.js';
import { initialCoupons } from './coupons.js';

const app = express();

app.use(cors());
app.use(express.json());

// In-memory data store with fallback for local and serverless demo
let products = [...initialProducts];
let orders = [...initialOrders];
let coupons = [...initialCoupons];

// Helper to calculate totals server-side
function calculateOrderTotals(items) {
  let subtotal = 0;
  for (const item of items) {
    const prod = products.find(p => p.id === item.productId || p.id === item.id);
    if (prod) {
      subtotal += prod.price * (item.quantity || 1);
    } else if (item.price) {
      subtotal += item.price * (item.quantity || 1);
    }
  }
  const shippingFee = subtotal >= 3000 ? 0 : 150;
  return {
    subtotal,
    shippingFee,
    total: subtotal + shippingFee
  };
}

// ---------------- PRODUCTS ROUTES ----------------

// GET /api/products
app.get('/api/products', (req, res) => {
  const { category, gender, featured, search, sort } = req.query;
  let result = [...products];

  if (category && category !== 'All') {
    result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (gender) {
    result = result.filter(p => p.gender?.toLowerCase() === gender.toLowerCase());
  }

  if (featured === 'true') {
    result = result.filter(p => p.isFeatured);
  }

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }

  if (sort === 'price-low') {
    result.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    result.sort((a, b) => b.price - a.price);
  } else if (sort === 'newest') {
    result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  }

  res.json({ success: true, count: result.length, data: result });
});

// GET /api/products/:slugOrId
app.get('/api/products/:identifier', (req, res) => {
  const { identifier } = req.params;
  const product = products.find(p => p.id === identifier || p.slug === identifier);
  
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  // Also include 4 related products
  const related = products
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  res.json({ success: true, data: product, related });
});

// POST /api/products (Admin create)
app.post('/api/products', (req, res) => {
  const { name, category, gender, price, compareAtPrice, description, images, variants, isFeatured, isNew } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ success: false, message: 'Name, price and category are required' });
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

  const newProduct = {
    id: `sp-${Date.now()}`,
    name,
    slug,
    category,
    gender: gender || 'Unisex',
    price: Number(price),
    compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
    description: description || '',
    images: images && images.length ? images : ['https://images.pexels.com/photos/1342609/pexels-photo-1342609.jpeg'],
    isFeatured: Boolean(isFeatured),
    isNew: Boolean(isNew),
    variants: variants && variants.length ? variants : [
      { id: `v-${Date.now()}-1`, size: 'M', color: 'Default', stock: 10 }
    ]
  };

  products.unshift(newProduct);
  res.status(201).json({ success: true, data: newProduct });
});

// PUT /api/products/:id (Admin update)
app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  products[index] = {
    ...products[index],
    ...req.body,
    price: Number(req.body.price ?? products[index].price),
    compareAtPrice: req.body.compareAtPrice ? Number(req.body.compareAtPrice) : products[index].compareAtPrice
  };

  res.json({ success: true, data: products[index] });
});

// DELETE /api/products/:id (Admin delete)
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = products.length;
  products = products.filter(p => p.id !== id);

  if (products.length === initialLength) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  res.json({ success: true, message: 'Product deleted successfully' });
});

// ---------------- ORDERS ROUTES ----------------

// GET /api/orders (Admin list)
app.get('/api/orders', (req, res) => {
  const { status, search } = req.query;
  let result = [...orders];

  if (status && status !== 'ALL') {
    result = result.filter(o => o.orderStatus === status);
  }

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(o => 
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerPhone.includes(q)
    );
  }

  res.json({ success: true, count: result.length, data: result });
});

// GET /api/orders/:orderNumber (Lookup / tracking)
app.get('/api/orders/:orderNumber', (req, res) => {
  const { orderNumber } = req.params;
  const order = orders.find(o => o.orderNumber.toUpperCase() === orderNumber.toUpperCase() || o.id === orderNumber);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  res.json({ success: true, data: order });
});

// POST /api/orders (Customer checkout)
app.post('/api/orders', (req, res) => {
  const {
    customerName,
    customerEmail,
    customerPhone,
    shippingAddress,
    items,
    paymentMethod,
    notes
  } = req.body;

  if (!customerName || !customerPhone || !shippingAddress || !items || !items.length) {
    return res.status(400).json({ success: false, message: 'Missing required order fields' });
  }

  // Calculate totals server-side
  const { subtotal, shippingFee, total } = calculateOrderTotals(items);

  // Generate unique order number
  const randCode = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `SP-${new Date().getFullYear()}-${randCode}`;

  // Determine initial payment status
  let initialPaymentStatus = 'PENDING';
  if (paymentMethod === 'MANUAL_UPI') {
    initialPaymentStatus = 'AWAITING_VERIFICATION';
  }

  const newOrder = {
    id: `ord-${Date.now()}`,
    orderNumber,
    customerName,
    customerEmail: customerEmail || null,
    customerPhone,
    shippingAddress,
    items: items.map(item => ({
      id: item.id || item.productId,
      name: item.name,
      variant: item.variant || `${item.selectedSize || 'Standard'} / ${item.selectedColor || 'Default'}`,
      price: item.price,
      quantity: item.quantity,
      image: item.image || (item.images && item.images[0]) || ''
    })),
    subtotal,
    shippingFee,
    total,
    paymentMethod: paymentMethod || 'COD',
    paymentStatus: initialPaymentStatus,
    orderStatus: 'PENDING_CONFIRMATION',
    trackingNumber: null,
    notes: notes || null,
    createdAt: new Date().toISOString()
  };

  // Adjust stock in inventory
  for (const it of items) {
    const prod = products.find(p => p.id === (it.id || it.productId));
    if (prod && prod.variants) {
      const variant = prod.variants.find(v => 
        (it.variantId && v.id === it.variantId) || 
        (it.selectedSize && v.size === it.selectedSize && v.color === it.selectedColor)
      );
      if (variant && variant.stock >= it.quantity) {
        variant.stock -= it.quantity;
      }
    }
  }

  orders.unshift(newOrder);

  res.status(201).json({
    success: true,
    message: 'Order placed successfully',
    data: newOrder
  });
});

// PATCH /api/orders/:id (Admin update status, verify UPI, tracking)
app.patch('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const { orderStatus, paymentStatus, trackingNumber } = req.body;

  const order = orders.find(o => o.id === id || o.orderNumber === id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  if (orderStatus) order.orderStatus = orderStatus;
  if (paymentStatus) order.paymentStatus = paymentStatus;
  if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;

  res.json({ success: true, message: 'Order updated', data: order });
});

// GET /api/admin/metrics (Admin overview metrics)
app.get('/api/admin/metrics', (req, res) => {
  const totalOrders = orders.length;
  const verifiedRevenue = orders
    .filter(o => o.paymentStatus === 'PAID' || (o.paymentMethod === 'COD' && o.orderStatus === 'DELIVERED'))
    .reduce((sum, o) => sum + o.total, 0);

  const pendingVerificationCount = orders.filter(o => o.paymentStatus === 'AWAITING_VERIFICATION').length;
  const activeOrdersCount = orders.filter(o => !['DELIVERED', 'CANCELLED'].includes(o.orderStatus)).length;
  
  // Low stock products (any variant < 8)
  const lowStockProducts = products.filter(p => 
    p.variants.some(v => v.stock < 8)
  );

  res.json({
    success: true,
    data: {
      totalOrders,
      verifiedRevenue,
      pendingVerificationCount,
      activeOrdersCount,
      totalProducts: products.length,
      lowStockCount: lowStockProducts.length,
      recentOrders: orders.slice(0, 5)
    }
  });
});

// ---------------- COUPONS ROUTES ----------------

// GET /api/coupons (Admin list all or client active coupons)
app.get('/api/coupons', (req, res) => {
  res.json({ success: true, count: coupons.length, data: coupons });
});

// POST /api/coupons/validate (Customer validation at checkout)
app.post('/api/coupons/validate', (req, res) => {
  const { code, subtotal } = req.body;
  if (!code) {
    return res.status(400).json({ success: false, message: 'Coupon code is required' });
  }

  const found = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
  if (!found || !found.isActive) {
    return res.status(400).json({ success: false, message: 'Invalid or expired coupon code' });
  }

  if (subtotal < (found.minOrderValue || 0)) {
    return res.status(400).json({ 
      success: false, 
      message: `Minimum order value of ₹${found.minOrderValue.toLocaleString('en-IN')} required for ${found.code}` 
    });
  }

  let discountAmount = 0;
  if (found.discountType === 'PERCENTAGE') {
    discountAmount = Math.round((subtotal * found.discountValue) / 100);
  } else {
    discountAmount = found.discountValue;
  }

  res.json({
    success: true,
    message: `Coupon ${found.code} applied!`,
    data: {
      id: found.id,
      code: found.code,
      discountType: found.discountType,
      discountValue: found.discountValue,
      discountAmount
    }
  });
});

// POST /api/coupons (Admin create coupon)
app.post('/api/coupons', (req, res) => {
  const { code, discountType, discountValue, minOrderValue, description } = req.body;

  if (!code || !discountValue) {
    return res.status(400).json({ success: false, message: 'Code and discount value are required' });
  }

  const existing = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
  if (existing) {
    return res.status(400).json({ success: false, message: 'Coupon with this code already exists' });
  }

  const newCoupon = {
    id: `cpn-${Date.now()}`,
    code: code.trim().toUpperCase(),
    discountType: discountType || 'PERCENTAGE',
    discountValue: Number(discountValue),
    minOrderValue: Number(minOrderValue) || 0,
    isActive: true,
    description: description || ''
  };

  coupons.unshift(newCoupon);
  res.status(201).json({ success: true, message: 'Coupon created', data: newCoupon });
});

// PATCH /api/coupons/:id/toggle (Admin toggle active status)
app.patch('/api/coupons/:id/toggle', (req, res) => {
  const { id } = req.params;
  const coupon = coupons.find(c => c.id === id);
  if (!coupon) {
    return res.status(404).json({ success: false, message: 'Coupon not found' });
  }
  coupon.isActive = !coupon.isActive;
  res.json({ success: true, message: `Coupon ${coupon.code} is now ${coupon.isActive ? 'Active' : 'Inactive'}`, data: coupon });
});

// DELETE /api/coupons/:id (Admin delete coupon)
app.delete('/api/coupons/:id', (req, res) => {
  const { id } = req.params;
  const prevCount = coupons.length;
  coupons = coupons.filter(c => c.id !== id);
  if (coupons.length === prevCount) {
    return res.status(404).json({ success: false, message: 'Coupon not found' });
  }
  res.json({ success: true, message: 'Coupon deleted successfully' });
});

export default app;

import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { initialCoupons } from '../data/coupons';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('sapiens_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('sapiens_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem('sapiens_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sapiens_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('sapiens_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem('sapiens_coupon', JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem('sapiens_coupon');
      }
    } catch (e) {
      console.error(e);
    }
  }, [appliedCoupon]);

  const addToCart = (product, selectedVariant, quantity = 1) => {
    if (!selectedVariant) {
      toast.error('Please choose a size & color', { id: 'variant-required' });
      return false;
    }

    if (selectedVariant.stock <= 0) {
      toast.error('Selected variant is out of stock', { id: 'out-of-stock' });
      return false;
    }

    const existingItem = cart.find(
      item => item.id === product.id && item.variantId === selectedVariant.id
    );

    if (existingItem) {
      const newQty = existingItem.quantity + quantity;
      if (newQty > selectedVariant.stock) {
        toast.error(`Only ${selectedVariant.stock} items available in stock`, { id: 'stock-limit' });
        return false;
      }
      setCart(prev =>
        prev.map(item =>
          item.id === product.id && item.variantId === selectedVariant.id
            ? { ...item, quantity: newQty }
            : item
        )
      );
      toast.success(`Updated quantity in cart (${newQty})`, { id: `cart-${product.id}` });
    } else {
      setCart(prev => [
        ...prev,
        {
          id: product.id,
          productId: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          image: product.images[0],
          variantId: selectedVariant.id,
          selectedSize: selectedVariant.size,
          selectedColor: selectedVariant.color,
          maxStock: selectedVariant.stock,
          quantity
        }
      ]);
      toast.success(`${product.name} added to cart`, { id: `cart-${product.id}` });
    }
    return true;
  };

  const updateQuantity = (variantId, delta) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.variantId === variantId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          if (newQty > item.maxStock) {
            toast.error(`Stock limit reached (${item.maxStock})`, { id: 'stock-limit' });
            return item;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (variantId) => {
    const itemToRemove = cart.find(i => i.variantId === variantId);
    setCart(prev => prev.filter(item => item.variantId !== variantId));
    
    if (itemToRemove) {
      toast((t) => (
        <div className="flex items-center gap-3">
          <span>Removed {itemToRemove.name.slice(0, 20)}...</span>
          <button
            onClick={() => {
              setCart(prev => [...prev, itemToRemove]);
              toast.dismiss(t.id);
            }}
            className="text-xs font-semibold underline text-[#FF5500] uppercase tracking-wider"
          >
            Undo
          </button>
        </div>
      ), { id: `remove-${variantId}`, duration: 4000 });
    }
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const toggleWishlist = (product) => {
    const exists = wishlist.some(p => p.id === product.id);
    if (exists) {
      setWishlist(prev => prev.filter(p => p.id !== product.id));
      toast.success(`Removed from wishlist`, { id: `wishlist-${product.id}` });
    } else {
      setWishlist(prev => [...prev, product]);
      toast.success(`Added to wishlist`, { id: `wishlist-${product.id}` });
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Apply Coupon Logic
  const applyCoupon = async (codeStr) => {
    if (!codeStr || !codeStr.trim()) {
      toast.error('Please enter a coupon code', { id: 'cpn-err' });
      return false;
    }

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeStr.trim(), subtotal })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Invalid coupon');
      }
      setAppliedCoupon(data.data);
      toast.success(`Coupon ${data.data.code} applied! Saved ₹${data.data.discountAmount.toLocaleString('en-IN')}`, { id: 'cpn-ok' });
      return true;
    } catch (err) {
      // Local fallback in case standalone server isn't running
      const found = initialCoupons.find(c => c.code.toUpperCase() === codeStr.trim().toUpperCase());
      if (found && found.isActive) {
        if (subtotal < found.minOrderValue) {
          toast.error(`Minimum order of ₹${found.minOrderValue.toLocaleString('en-IN')} required for ${found.code}`, { id: 'cpn-err' });
          return false;
        }
        const discountAmount = found.discountType === 'PERCENTAGE' 
          ? Math.round((subtotal * found.discountValue) / 100) 
          : found.discountValue;
        const cpnData = { ...found, discountAmount };
        setAppliedCoupon(cpnData);
        toast.success(`Coupon ${found.code} applied! Saved ₹${discountAmount.toLocaleString('en-IN')}`, { id: 'cpn-ok' });
        return true;
      }
      toast.error(err.message || 'Invalid or expired coupon', { id: 'cpn-err' });
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast.success('Coupon removed', { id: 'cpn-rm' });
  };

  // Discount calculation
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'PERCENTAGE') {
      discountAmount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
    } else {
      discountAmount = Math.min(appliedCoupon.discountValue, subtotal);
    }
  }

  const shippingFee = (subtotal - discountAmount) >= 3000 || subtotal === 0 ? 0 : 150;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        discountAmount,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        shippingFee,
        total,
        itemCount,
        wishlist,
        toggleWishlist
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

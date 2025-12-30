'use client';

import { useEffect, useState } from 'react';
import { getAccessToken } from '@/lib/authClient';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Tag,
  Truck,
  Shield,
  CreditCard,
  X
} from 'lucide-react';
import { Product } from '@/types/product';

interface CartItem extends Product {
  quantity: number;
}

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);

  // Load cart on mount: if logged in, fetch server cart; otherwise use localStorage
  useEffect(() => {
    (async () => {
      await loadCart();
      setLoading(false);
    })();

    // Listen for cart updates
    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  async function loadCart() {
    const token = getAccessToken();
    if (token) {
      try {
        const res = await fetch('/api/cart', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data?.success && data.cart?.items) {
          // items are { product, quantity }
          const items = data.cart.items.map((it: { product: Product; quantity: number }) => ({ ...it.product, quantity: it.quantity }));
          setCartItems(items);
          return;
        }
      } catch (err) {
        console.error('Failed to load server cart, falling back to localStorage', err);
      }
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const items = (cart as Array<Partial<Product> & { quantity?: number }>).map((p) => ({ ...(p as Product), quantity: p.quantity || 1 }));
    setCartItems(items);
  }

  const saveCart = (items: CartItem[]) => {
    localStorage.setItem('cart', JSON.stringify(items));
    setCartItems(items);
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    const token = getAccessToken();
    if (token) {
      try {
        await fetch('/api/cart/update', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ productId, quantity: newQuantity }),
        });
        await loadCart();
        return;
      } catch (err) {
        console.error('Failed to update server cart, falling back to local update', err);
      }
    }

    const updatedCart = cartItems.map(item =>
      item._id === productId ? { ...item, quantity: newQuantity } : item
    );
    saveCart(updatedCart);
  };

  const removeItem = async (productId: string) => {
    const token = getAccessToken();
    if (token) {
      try {
        await fetch('/api/cart/remove', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ productId }),
        });
        await loadCart();
        return;
      } catch (err) {
        console.error('Failed to remove from server cart, falling back to local remove', err);
      }
    }

    const updatedCart = cartItems.filter(item => item._id !== productId);
    saveCart(updatedCart);
  };

  const clearCart = async () => {
    if (!confirm('Are you sure you want to clear your cart?')) return;
    const token = getAccessToken();
    if (token) {
      try {
        // remove each item on server
        for (const item of cartItems) {
          await fetch('/api/cart/remove', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ productId: item._id }),
          });
        }
        await loadCart();
        setAppliedCoupon(null);
        setDiscount(0);
        return;
      } catch (err) {
        console.error('Failed to clear server cart, falling back to local clear', err);
      }
    }

    saveCart([]);
    setAppliedCoupon(null);
    setDiscount(0);
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;

    // TODO: Replace with your actual coupon validation API
    try {
      // const response = await fetch('/api/coupons/validate', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ code: couponCode })
      // });
      // const data = await response.json();
      // if (data.valid) {
      //   setAppliedCoupon(couponCode);
      //   setDiscount(data.discountPercentage);
      // }

      alert('Coupon validation API not configured');
    } catch (error) {
      console.error('Error applying coupon:', error);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponCode('');
  };

  const handleCheckout = async () => {
    // TODO: Replace with your actual checkout API
    try {
      // const response = await fetch('/api/checkout', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     items: cartItems,
      //     couponCode: appliedCoupon,
      //     subtotal,
      //     tax,
      //     shipping,
      //     total
      //   })
      // });
      // const data = await response.json();
      // if (data.success) {
      //   router.push(`/checkout/${data.orderId}`);
      // }

      alert('Checkout API not configured');
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.discountPrice || item.price;
    return sum + price * item.quantity;
  }, 0);

  const discountAmount = (subtotal * discount) / 100;
  const subtotalAfterDiscount = subtotal - discountAmount;
  const shipping = subtotalAfterDiscount > 100 ? 0 : 9.99;
  const tax = subtotalAfterDiscount * 0.08; // 8% tax
  const total = subtotalAfterDiscount + shipping + tax;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.push('/collections')}
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Continue Shopping
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Shopping Cart</h1>
          </div>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center mb-6 border border-gray-700">
              <ShoppingCart className="w-12 h-12 text-gray-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
            <p className="text-gray-400 mb-8 text-center max-w-md">
              Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
            </p>
            <button
              onClick={() => router.push('/products')}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg font-bold hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] hover:-translate-y-0.5 transition-all"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Continue Shopping
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Shopping Cart ({cartItems.length})
            </h1>
            <button
              onClick={clearCart}
              className="text-red-400 hover:text-red-300 transition-colors text-sm font-medium"
            >
              Clear Cart
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden hover:border-cyan-500/30 transition-all shadow-lg"
              >
                <div className="p-4 md:p-6">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-4 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg md:text-xl font-bold text-white truncate mb-1">
                            {item.name}
                          </h3>
                          <p className="text-sm text-cyan-400">{item.anime}</p>
                          {item.character && (
                            <p className="text-sm text-purple-300">{item.character}</p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item._id)}
                          className="text-red-400 hover:text-red-300 transition-colors p-2 h-fit"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Price and Quantity */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xl md:text-2xl font-bold text-white">
                              ₹{(item.discountPrice || item.price).toFixed(2)}
                            </span>
                            {item.discountPrice && (
                              <span className="text-sm text-gray-400 line-through">
                                ₹{item.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                          {item.stock < 10 && (
                            <p className="text-xs text-yellow-400 mt-1">
                              Only {item.stock} left in stock
                            </p>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg p-1 border border-gray-700 w-fit">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className={`p-2 rounded-md transition-all ${
                              item.quantity <= 1
                                ? 'text-gray-600 cursor-not-allowed'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4" />
                          </button>

                          <span className="font-bold text-white min-w-[2rem] text-center">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            className={`p-2 rounded-md transition-all ${
                              item.quantity >= item.stock
                                ? 'text-gray-600 cursor-not-allowed'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`}
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-400">Item Total:</span>
                          <span className="text-lg font-bold text-cyan-400">
                            ₹{((item.discountPrice || item.price) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-cyan-500/20 p-6 sticky top-4 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>

              {/* Coupon Code */}
              <div className="mb-6">
                <label className="text-sm text-gray-400 mb-2 block">Coupon Code</label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 font-medium">{appliedCoupon}</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter code"
                      className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                    <button
                      onClick={applyCoupon}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount ({discount}%)</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-300">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : '₹' + shipping.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-300">
                  <span>Tax (8%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>

                <div className="border-t border-gray-700 pt-3 flex justify-between text-xl font-bold text-white">
                  <span>Total</span>
                  <span className="text-cyan-400">₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg font-bold hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 mb-4"
              >
                <CreditCard className="w-5 h-5" />
                Proceed to Checkout
              </button>

              {/* Info Cards */}
                <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Truck className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="text-gray-300">
                    {shipping === 0 ? 'Free shipping applied!' : 'Free shipping on orders over ₹100'}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-green-400" />
                  </div>
                  <span className="text-gray-300">Secure checkout guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
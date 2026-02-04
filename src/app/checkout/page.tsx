'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken } from '@/lib/authClient';
import {
  MapPin,
  Plus,
  ChevronDown,
  ShoppingBag,
  Loader2,
  AlertCircle,
  Check,
  CreditCard,
  ArrowLeft,
} from 'lucide-react';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';

interface Address {
  _id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

interface CartItem {
  product: any;
  quantity: number;
}

const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

export default function CheckoutPage() {
  const router = useRouter();
  const cartItems = useCartStore((state) => state.items);

  // Address state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  // New address form
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    isDefault: false,
  });

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product.discountPrice || item.product.price) * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Load addresses
  useEffect(() => {
    const loadAddresses = async () => {
      const token = getAccessToken();
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch('/api/user/addresses', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.success && data.addresses) {
          const addressesWithIds = data.addresses.map((addr: any, idx: number) => ({
            ...addr,
            _id: addr._id || `address-${idx}`, // Fallback if _id not present
          }));
          setAddresses(addressesWithIds);
          
          // Set default address or first address
          const defaultAddress = addressesWithIds.find((addr: Address) => addr.isDefault);
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress._id);
          } else if (addressesWithIds.length > 0) {
            setSelectedAddressId(addressesWithIds[0]._id);
          } else {
            setShowAddressForm(true);
          }
        } else {
          // No addresses, show form
          setShowAddressForm(true);
        }
      } catch (err) {
        console.error('Failed to load addresses:', err);
        setShowAddressForm(true);
      } finally {
        setLoading(false);
      }
    };

    loadAddresses();
  }, [router]);

  // Handle address form input
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  // Add new address
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAccessToken();

    try {
      const res = await fetch('/api/user/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setAddresses([...addresses, data.address]);
        setSelectedAddressId(data.address._id);
        setShowAddressForm(false);
        setFormData({
          fullName: '',
          phone: '',
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          postalCode: '',
          country: 'India',
          isDefault: false,
        });
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to add address');
      console.error(err);
    }
  };

  // Handle checkout
  const handleCheckout = async () => {
    if (!selectedAddressId) {
      setError('Please select an address');
      return;
    }

    setProcessing(true);
    setError('');
    const token = getAccessToken();

    try {
      // Step 1: Create order
      const orderRes = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          addressId: selectedAddressId,
          paymentMethod: 'razorpay',
        }),
      });

      const orderData = await orderRes.json();

      if (!orderData.success) {
        setError(orderData.message);
        setProcessing(false);
        return;
      }

      const orderId = orderData.order._id;

      // Step 2: Create Razorpay order
      const razorpayRes = await fetch('/api/orders/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId }),
      });

      const razorpayData = await razorpayRes.json();

      if (!razorpayData.success) {
        setError(razorpayData.message);
        setProcessing(false);
        return;
      }

      // Step 3: Initiate Razorpay payment
      if (!RAZORPAY_KEY) {
        setError('Razorpay key not configured');
        setProcessing(false);
        return;
      }

      const options = {
        key: RAZORPAY_KEY,
        amount: Math.round(total * 100),
        currency: 'INR',
        order_id: razorpayData.razorpayOrderId,
        handler: async (response: any) => {
          try {
            // Verify payment
            const verifyRes = await fetch('/api/orders/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                orderId,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              // Redirect to success page
              router.push(`/order-success/${orderId}`);
            } else {
              setError('Payment verification failed');
              setProcessing(false);
            }
          } catch (err) {
            setError('Payment verification failed');
            setProcessing(false);
            console.error(err);
          }
        },
        prefill: {
          name: formData.fullName || 'Customer',
          email: 'customer@example.com',
          contact: formData.phone || '',
        },
        theme: {
          color: '#06b6d4',
        },
      };

      // Load and open Razorpay
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        const Razorpay = (window as any).Razorpay;
        const razorpay = new Razorpay(options);
        razorpay.open();
        setProcessing(false);
      };
      document.body.appendChild(script);
    } catch (err) {
      setError('Checkout failed. Please try again.');
      setProcessing(false);
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Cart
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <span className="text-red-300 text-sm">{error}</span>
              </div>
            )}

            {/* Shipping Address Section */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-cyan-500/20 p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <MapPin className="w-6 h-6 mr-3 text-cyan-400" />
                Shipping Address
              </h2>

              {addresses.length > 0 && !showAddressForm && (
                <div className="space-y-4 mb-6">
                  {addresses.map((address) => (
                    <label
                      key={address._id}
                      className="flex items-start gap-3 p-4 border border-gray-700 rounded-lg cursor-pointer hover:border-cyan-500/50 transition-colors"
                    >
                      <input
                        type="radio"
                        name="address"
                        value={address._id}
                        checked={selectedAddressId === address._id}
                        onChange={(e) => setSelectedAddressId(e.target.value)}
                        className="w-4 h-4 mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-white">
                          {address.fullName}
                          {address.isDefault && (
                            <span className="ml-2 text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                          <p>{address.addressLine1}</p>
                          {address.addressLine2 && <p>{address.addressLine2}</p>}
                          <p>
                            {address.city}, {address.state} {address.postalCode}
                          </p>
                          <p>{address.country}</p>
                          <p className="mt-1">Phone: {address.phone}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {/* Add New Address Button */}
              {!showAddressForm && (
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="w-full py-3 border-2 border-dashed border-cyan-500/30 text-cyan-300 rounded-lg font-semibold hover:border-cyan-500 hover:bg-cyan-500/10 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add New Address
                </button>
              )}

              {/* Address Form */}
              {showAddressForm && (
                <form onSubmit={handleAddAddress} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name"
                      value={formData.fullName}
                      onChange={handleFormChange}
                      required
                      className="col-span-1 md:col-span-2 bg-gray-800/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none"
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleFormChange}
                      required
                      className="col-span-1 md:col-span-2 bg-gray-800/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none"
                    />
                    <input
                      type="text"
                      name="addressLine1"
                      placeholder="Address Line 1"
                      value={formData.addressLine1}
                      onChange={handleFormChange}
                      required
                      className="col-span-1 md:col-span-2 bg-gray-800/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none"
                    />
                    <input
                      type="text"
                      name="addressLine2"
                      placeholder="Address Line 2 (Optional)"
                      value={formData.addressLine2}
                      onChange={handleFormChange}
                      className="col-span-1 md:col-span-2 bg-gray-800/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none"
                    />
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleFormChange}
                      required
                      className="bg-gray-800/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none"
                    />
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={formData.state}
                      onChange={handleFormChange}
                      required
                      className="bg-gray-800/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none"
                    />
                    <input
                      type="text"
                      name="postalCode"
                      placeholder="Postal Code"
                      value={formData.postalCode}
                      onChange={handleFormChange}
                      required
                      className="bg-gray-800/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none"
                    />
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleFormChange}
                      className="bg-gray-800/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none"
                    >
                      <option>India</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="isDefault"
                      checked={formData.isDefault}
                      onChange={handleFormChange}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-300">Set as default address</span>
                  </label>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg font-bold hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all"
                    >
                      Save Address
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="flex-1 py-3 border border-gray-700 text-gray-300 rounded-lg font-bold hover:bg-gray-800/50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-cyan-500/20 p-6 sticky top-4 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <ShoppingBag className="w-6 h-6 mr-3 text-cyan-400" />
                Order Summary
              </h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.product._id} className="flex gap-3 pb-4 border-b border-gray-700">
                    <div className="w-16 h-16 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                      {item.product.images?.[0] ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white line-clamp-2">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold text-cyan-400">
                        ₹{((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div className="space-y-3 pt-6 border-t border-gray-700">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Shipping</span>
                  <span className={subtotal > 100 ? 'text-green-400' : ''}>
                    {subtotal > 100 ? 'Free' : `₹${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Tax (8%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-cyan-400 pt-3 border-t border-gray-700">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h3 className="text-white font-semibold mb-3">Payment Method</h3>
                <div className="p-3 border border-cyan-500/50 rounded-lg bg-gradient-to-r from-cyan-500/10 to-purple-500/10">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-cyan-400" />
                    <div className="flex-1">
                      <div className="text-white font-semibold">Razorpay Payment</div>
                      <div className="text-xs text-gray-400">Credit Card, Debit Card, UPI, and more</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={processing || !selectedAddressId}
                className="w-full mt-6 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg font-bold hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Proceed to Payment
                  </>
                )}
              </button>

              {/* Info */}
              <p className="text-xs text-gray-400 text-center mt-4">
                You will be redirected to Razorpay to complete your payment securely
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

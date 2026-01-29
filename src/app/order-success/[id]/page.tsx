'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getAccessToken } from '@/lib/authClient';
import {
  Check,
  Package,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';

interface OrderItem {
  product: any;
  quantity: number;
  priceAtPurchase: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: any;
  paymentStatus: string;
  orderStatus: string;
  razorpayPaymentId: string;
  createdAt: string;
}

export default function OrderSuccessPage() {
  const router = useRouter();
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      const token = getAccessToken();
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch(`/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (data.success) {
          setOrder(data.order);
        } else {
          setError(data.message || 'Order not found');
        }
      } catch (err) {
        setError('Failed to load order details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">✗</div>
          <h1 className="text-2xl font-bold text-white mb-2">Error</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg font-bold hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const itemTotal = order.items.reduce(
    (sum, item) => sum + item.priceAtPurchase * item.quantity,
    0
  );
  const shipping = itemTotal > 100 ? 0 : 9.99;
  const tax = itemTotal * 0.08;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Success Message */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Order Confirmed!</h1>
            <p className="text-gray-400 text-lg">Thank you for your purchase</p>
          </div>

          {/* Order ID */}
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-cyan-500/20 p-6 mb-8">
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">Order ID</p>
              <p className="text-2xl font-bold text-cyan-400 font-mono">{order._id}</p>
              {order.razorpayPaymentId && (
                <>
                  <p className="text-gray-400 text-sm mt-4 mb-2">Payment ID</p>
                  <p className="text-sm text-cyan-300 font-mono break-all">{order.razorpayPaymentId}</p>
                </>
              )}
            </div>
          </div>

          {/* Order Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Shipping Address */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-cyan-500/20 p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-cyan-400" />
                Shipping Address
              </h2>
              <div className="space-y-2 text-gray-300">
                <p className="font-semibold">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && (
                  <p>{order.shippingAddress.addressLine2}</p>
                )}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
                <p className="pt-2 flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-cyan-400" />
                  {order.shippingAddress.phone}
                </p>
              </div>
            </div>

            {/* Order Status */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-cyan-500/20 p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2 text-cyan-400" />
                Order Status
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Payment Status</p>
                  <p className="text-lg font-bold">
                    <span className="inline-block px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-sm">
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Order Status</p>
                  <p className="text-lg font-bold">
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm">
                      {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-cyan-500/20 p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-6">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 pb-4 border-b border-gray-700 last:border-b-0"
                >
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
                    <p className="font-semibold text-white">{item.product.name}</p>
                    <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-cyan-400 font-bold">
                      ₹{(item.priceAtPurchase * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400">₹{item.priceAtPurchase.toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-cyan-500/20 p-6 mb-8">
            <div className="space-y-3">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span>₹{itemTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Shipping</span>
                <span className={itemTotal > 100 ? 'text-green-400' : ''}>
                  {itemTotal > 100 ? 'Free' : `₹${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Tax (8%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-cyan-400 pt-3 border-t border-gray-700">
                <span>Total Amount</span>
                <span>₹{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-bold text-cyan-300 mb-3">What's Next?</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="inline-block w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-center text-sm mr-3 flex-shrink-0">
                  1
                </span>
                We've confirmed your order and payment
              </li>
              <li className="flex items-start">
                <span className="inline-block w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-center text-sm mr-3 flex-shrink-0">
                  2
                </span>
                You'll receive a confirmation email shortly
              </li>
              <li className="flex items-start">
                <span className="inline-block w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-center text-sm mr-3 flex-shrink-0">
                  3
                </span>
                Your order will be shipped within 2-3 business days
              </li>
              <li className="flex items-start">
                <span className="inline-block w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-center text-sm mr-3 flex-shrink-0">
                  4
                </span>
                Track your package in the account section
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Link
              href="/"
              className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg font-bold text-center hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all"
            >
              Continue Shopping
            </Link>
            <Link
              href="/account"
              className="flex-1 py-3 border-2 border-cyan-500/30 text-cyan-300 rounded-lg font-bold text-center hover:border-cyan-500 hover:bg-cyan-500/10 transition-colors"
            >
              View Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

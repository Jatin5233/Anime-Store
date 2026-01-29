'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getAccessToken } from '@/lib/authClient';
import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  Package,
  MapPin,
  DollarSign,
  CreditCard,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';

interface OrderItem {
  product: {
    _id: string;
    name: string;
    images: string[];
  };
  quantity: number;
  priceAtPurchase: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  orderStatus: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  razorpayPaymentId?: string;
  createdAt: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

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
        const res = await fetch(`/api/user/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.success) {
          setOrder(data.order);
        } else {
          setError(data.message || 'Failed to load order');
        }
      } catch (err) {
        setError('Failed to load order');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, router]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Clock className="w-6 h-6 text-yellow-400" />;
      case 'shipped':
        return <Truck className="w-6 h-6 text-blue-400" />;
      case 'delivered':
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'cancelled':
        return <XCircle className="w-6 h-6 text-red-400" />;
      default:
        return <Package className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30';
      case 'shipped':
        return 'bg-blue-500/10 text-blue-300 border-blue-500/30';
      case 'delivered':
        return 'bg-green-500/10 text-green-300 border-green-500/30';
      case 'cancelled':
        return 'bg-red-500/10 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/10 text-gray-300 border-gray-500/30';
    }
  };

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

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">{error || 'Order not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = order.items.reduce((sum, item) => sum + item.priceAtPurchase * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Orders
        </button>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 mb-6">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span className="text-red-300 text-sm">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Status */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-cyan-500/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">Order #{order._id.slice(-6).toUpperCase()}</h2>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(order.orderStatus)}`}>
                  {getStatusIcon(order.orderStatus)}
                  <span className="font-semibold capitalize">{order.orderStatus}</span>
                </div>
              </div>
              <p className="text-gray-400">
                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            {/* Order Items */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-cyan-500/20 p-6">
              <h3 className="text-xl font-bold text-white mb-6">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-b border-gray-700 last:border-0">
                    <div className="w-24 h-24 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
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
                      <h4 className="font-semibold text-white mb-2">{item.product.name}</h4>
                      <div className="flex gap-4">
                        <div>
                          <p className="text-xs text-gray-400">Quantity</p>
                          <p className="text-white font-semibold">{item.quantity}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Price</p>
                          <p className="text-cyan-400 font-bold">₹{item.priceAtPurchase.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Subtotal</p>
                          <p className="text-cyan-400 font-bold">₹{(item.priceAtPurchase * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-cyan-500/20 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-cyan-400" />
                Shipping Address
              </h3>
              <div className="space-y-2 text-gray-300">
                <p className="font-semibold text-white">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
                <p className="pt-2 border-t border-gray-700">Phone: {order.shippingAddress.phone}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Payment Information */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-cyan-500/20 p-6 sticky top-4">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-cyan-400" />
                Payment Details
              </h3>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-700">
                <div>
                  <p className="text-xs text-gray-400 uppercase">Payment Method</p>
                  <p className="text-white font-semibold capitalize">{order.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase">Payment Status</p>
                  <p className={`text-sm font-semibold ${
                    order.paymentStatus === 'paid' ? 'text-green-400' : 
                    order.paymentStatus === 'pending' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {order.paymentStatus === 'paid' ? '✓ Paid' : order.paymentStatus === 'pending' ? 'Pending' : 'Failed'}
                  </p>
                </div>
                {order.razorpayPaymentId && (
                  <div>
                    <p className="text-xs text-gray-400 uppercase">Payment ID</p>
                    <p className="text-xs text-gray-300 font-mono break-all">{order.razorpayPaymentId}</p>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-cyan-400" />
                Price Breakdown
              </h3>

              <div className="space-y-3">
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
                  <span>₹{order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

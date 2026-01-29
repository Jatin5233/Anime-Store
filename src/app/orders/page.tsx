'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken } from '@/lib/authClient';
import {
  Package,
  Loader2,
  AlertCircle,
  ArrowLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';

interface Order {
  _id: string;
  items: any[];
  totalAmount: number;
  orderStatus: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
  shippingAddress: {
    fullName: string;
    city: string;
    state: string;
  };
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'processing' | 'shipped' | 'delivered' | 'cancelled'>('all');

  useEffect(() => {
    const fetchOrders = async () => {
      const token = getAccessToken();
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch('/api/user/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.success) {
          setOrders(data.orders);
        } else {
          setError(data.message || 'Failed to load orders');
        }
      } catch (err) {
        setError('Failed to load orders');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  const filteredOrders = filter === 'all' ? orders : orders.filter(order => order.orderStatus === filter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-400" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Package className="w-5 h-5 text-gray-400" />;
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
          <p className="text-gray-400">Loading your orders...</p>
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
            Back
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">My Orders</h1>
          <p className="text-gray-400">Track and manage your orders</p>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 mb-6">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span className="text-red-300 text-sm">{error}</span>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {(['all', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all capitalize ${
                filter === status
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No orders found</p>
            <Link href="/" className="text-cyan-400 hover:text-cyan-300 mt-4 inline-block">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Link
                key={order._id}
                href={`/orders/${order._id}`}
                className="block bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-cyan-500/20 p-6 hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/10"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-bold text-white">Order #{order._id.slice(-6).toUpperCase()}</h3>
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(order.orderStatus)}`}>
                        {getStatusIcon(order.orderStatus)}
                        <span className="text-sm font-semibold capitalize">{order.orderStatus}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-400 uppercase">Items</p>
                        <p className="text-white font-semibold">{order.items.length}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase">Total</p>
                        <p className="text-cyan-400 font-bold">₹{order.totalAmount.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase">Payment</p>
                        <p className={`text-sm font-semibold ${
                          order.paymentStatus === 'paid' ? 'text-green-400' : 'text-yellow-400'
                        }`}>
                          {order.paymentStatus === 'paid' ? '✓ Paid' : 'Pending'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase">Shipped To</p>
                        <p className="text-white font-semibold text-sm">
                          {order.shippingAddress.city}, {order.shippingAddress.state}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  <ChevronRight className="w-6 h-6 text-gray-500 flex-shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

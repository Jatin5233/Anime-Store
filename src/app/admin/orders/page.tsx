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
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
} from 'lucide-react';
import Link from 'next/link';

interface Order {
  _id: string;
  user: {
    _id: string;
    email: string;
  };
  items: any[];
  totalAmount: number;
  orderStatus: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
}

interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  paidOrders: number;
  pendingOrders: number;
  averageOrderValue: number;
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'processing' | 'shipped' | 'delivered' | 'cancelled'>('all');

  useEffect(() => {
    const fetchOrdersAndStats = async () => {
      const token = getAccessToken();
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const [ordersRes, statsRes] = await Promise.all([
          fetch('/api/admin/orders', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('/api/admin/orders/stats/overview', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const ordersData = await ordersRes.json();
        const statsData = await statsRes.json();

        if (ordersData.success) {
          setOrders(ordersData.orders);
        } else {
          setError(ordersData.message || 'Failed to load orders');
        }

        if (statsData.success) {
          setStats(statsData.stats);
        }
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersAndStats();
  }, [router]);

  const filteredOrders = filter === 'all' ? orders : orders.filter(order => order.orderStatus === filter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return '⏳';
      case 'shipped':
        return '🚚';
      case 'delivered':
        return '✅';
      case 'cancelled':
        return '❌';
      default:
        return '📦';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading orders...</p>
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
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Order Management</h1>
          <p className="text-gray-400">Track and manage all customer orders</p>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 mb-6">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span className="text-red-300 text-sm">{error}</span>
          </div>
        )}

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-cyan-500/20 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Orders</p>
                  <p className="text-3xl font-bold text-white mt-2">{stats.totalOrders}</p>
                </div>
                <ShoppingCart className="w-8 h-8 text-cyan-400 opacity-50" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-green-500/20 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Revenue</p>
                  <p className="text-3xl font-bold text-green-400 mt-2">₹{stats.totalRevenue.toFixed(0)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-400 opacity-50" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-blue-500/20 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Paid Orders</p>
                  <p className="text-3xl font-bold text-blue-400 mt-2">{stats.paidOrders}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-400 opacity-50" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-yellow-500/20 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Pending Orders</p>
                  <p className="text-3xl font-bold text-yellow-400 mt-2">{stats.pendingOrders}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-yellow-400 opacity-50" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-purple-500/20 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Avg. Order Value</p>
                  <p className="text-3xl font-bold text-purple-400 mt-2">₹{stats.averageOrderValue.toFixed(0)}</p>
                </div>
                <Package className="w-8 h-8 text-purple-400 opacity-50" />
              </div>
            </div>
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

        {/* Orders Table */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700">
            <Package className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No orders found</p>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-cyan-500/20 overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700 bg-gray-900/50">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Order ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Items</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Payment</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="border-b border-gray-700 hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-white">#{order._id.slice(-6).toUpperCase()}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{order.user.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{order.items.length}</td>
                      <td className="px-6 py-4 text-sm font-bold text-cyan-400">₹{order.totalAmount.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="inline-flex items-center gap-1">
                          {getStatusIcon(order.orderStatus)}
                          <span className="capitalize">{order.orderStatus}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`text-xs font-semibold ${
                          order.paymentStatus === 'paid' ? 'text-green-400' : 'text-yellow-400'
                        }`}>
                          {order.paymentStatus === 'paid' ? '✓ Paid' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Link
                          href={`/admin/orders/${order._id}`}
                          className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                        >
                          View <ChevronRight className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4 p-4">
              {filteredOrders.map((order) => (
                <Link
                  key={order._id}
                  href={`/admin/orders/${order._id}`}
                  className="block p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-bold text-white">#{order._id.slice(-6).toUpperCase()}</h4>
                    <span className="inline-flex items-center gap-1 text-sm">
                      {getStatusIcon(order.orderStatus)}
                      <span className="capitalize text-xs text-gray-300">{order.orderStatus}</span>
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-400">
                    <p>Customer: {order.user.email}</p>
                    <p>Items: {order.items.length}</p>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                      <span className="font-bold text-cyan-400">₹{order.totalAmount.toFixed(2)}</span>
                      <span className={order.paymentStatus === 'paid' ? 'text-green-400 text-xs' : 'text-yellow-400 text-xs'}>
                        {order.paymentStatus === 'paid' ? '✓ Paid' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

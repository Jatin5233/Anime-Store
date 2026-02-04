'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingBag,
  BarChart3,
  LogOut,
  Menu,
  X,
  AlertCircle,
  Loader2,
  TrendingUp,
  DollarSign,
  Eye,
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/axios';
import { getAccessToken, clearAuth } from '@/lib/authClient';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  recentOrders: any[];
  orderStats: {
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentOrders: [],
    orderStats: { pending: 0, processing: 0, shipped: 0, delivered: 0 },
  });

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const token = getAccessToken();
        if (!token) {
          router.push('/login');
          return;
        }

        // Verify admin role
        const decoded = JSON.parse(atob(token.split('.')[1]));
        if (decoded.role !== 'admin') {
          router.push('/');
          return;
        }

        // Fetch dashboard stats
        await fetchDashboardStats(token);
      } catch (err) {
        console.error('Auth error:', err);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, [router]);

  const fetchDashboardStats = async (token: string) => {
    try {
      const [productsRes, ordersRes, usersRes, statsRes] = await Promise.all([
        api.get('/admin/products', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/admin/orders', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/admin/users/count', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/admin/orders/stats/overview', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const orders = ordersRes.data.orders || [];
      setStats({
        totalProducts: productsRes.data.products?.length || 0,
        totalOrders: orders.length || 0,
        totalUsers: usersRes.data.count || 0,
        totalRevenue: statsRes.data.totalRevenue || 0,
        recentOrders: orders.slice(0, 5),
        orderStats: {
          pending: orders.filter((o: any) => o.orderStatus === 'processing').length,
          processing: orders.filter((o: any) => o.orderStatus === 'processing').length,
          shipped: orders.filter((o: any) => o.orderStatus === 'shipped').length,
          delivered: orders.filter((o: any) => o.orderStatus === 'delivered').length,
        },
      });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleLogout = () => {
    clearAuth();
    router.push('/');
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin', badge: null },
    { name: 'Products', icon: Package, path: '/admin/products', badge: stats.totalProducts },
    { name: 'Orders', icon: ShoppingBag, path: '/admin/orders', badge: stats.totalOrders },
    { name: 'Users', icon: Users, path: '/admin/users', badge: null },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-950 to-gray-900">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-950">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-gray-900 to-gray-950 border-r border-cyan-500/20 transition-all duration-300 flex flex-col hidden md:flex`}>
        {/* Logo */}
        <div className="p-6 border-b border-cyan-500/20">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            {sidebarOpen && <span className="font-bold text-white text-lg">ADMIN</span>}
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="flex items-center justify-between px-4 py-3 rounded-lg text-gray-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="font-medium truncate">{item.name}</span>}
              </div>
              {sidebarOpen && item.badge !== null && (
                <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-full border border-cyan-500/30 flex-shrink-0">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-cyan-500/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>

        {/* Toggle Sidebar */}
        <div className="p-4 border-t border-cyan-500/20">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-800/50 transition-colors text-gray-400 hover:text-cyan-300"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-16 bg-gradient-to-r from-cyan-500/10 to-purple-600/10 border-b border-cyan-500/20 flex items-center justify-between px-6 md:px-8">
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-2">
            <Menu className="w-6 h-6 text-cyan-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 md:p-8 space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={Package}
                label="Total Products"
                value={stats.totalProducts}
                trend="+12%"
                color="cyan"
              />
              <StatCard
                icon={ShoppingBag}
                label="Total Orders"
                value={stats.totalOrders}
                trend="+8%"
                color="purple"
              />
              <StatCard
                icon={Users}
                label="Total Users"
                value={stats.totalUsers}
                trend="+5%"
                color="pink"
              />
              <StatCard
                icon={DollarSign}
                label="Total Revenue"
                value={`₹${stats.totalRevenue.toFixed(0)}`}
                trend="+15%"
                color="green"
              />
            </div>

            {/* Order Status Overview */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-2xl border border-cyan-500/20 p-8">
              <h2 className="text-xl font-bold text-white mb-6">Order Status Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <OrderStatusCard status="Pending" count={stats.orderStats.pending} color="yellow" />
                <OrderStatusCard status="Processing" count={stats.orderStats.processing} color="blue" />
                <OrderStatusCard status="Shipped" count={stats.orderStats.shipped} color="purple" />
                <OrderStatusCard status="Delivered" count={stats.orderStats.delivered} color="green" />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <QuickActionCard
                title="Add Product"
                description="Create a new product"
                href="/admin/products/new"
                icon={Package}
                color="cyan"
              />
              <QuickActionCard
                title="View Orders"
                description="Manage customer orders"
                href="/admin/orders"
                icon={ShoppingBag}
                color="purple"
              />
              <QuickActionCard
                title="View Users"
                description="Manage user accounts"
                href="/admin/users"
                icon={Users}
                color="pink"
              />
            </div>

            {/* Recent Orders */}
            {stats.recentOrders.length > 0 && (
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-2xl border border-cyan-500/20 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Recent Orders</h2>
                  <Link href="/admin/orders" className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold flex items-center gap-1">
                    View All <Eye className="w-4 h-4" />
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Order ID</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Customer</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Amount</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentOrders.map((order) => (
                        <tr key={order._id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                          <td className="py-3 px-4 text-white font-mono text-xs">{order._id.slice(-8).toUpperCase()}</td>
                          <td className="py-3 px-4 text-gray-300">{order.user?.email || 'N/A'}</td>
                          <td className="py-3 px-4 text-green-400 font-semibold">₹{order.totalAmount?.toFixed(2) || '0.00'}</td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                              order.orderStatus === 'delivered'
                                ? 'bg-green-500/20 text-green-300 border-green-500/30'
                                : order.orderStatus === 'shipped'
                                ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                            }`}>
                              {order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: any;
  label: string;
  value: string | number;
  trend: string;
  color: 'cyan' | 'purple' | 'pink' | 'green';
}

function StatCard({ icon: Icon, label, value, trend, color }: StatCardProps) {
  const colorClasses = {
    cyan: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30',
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
    pink: 'from-pink-500/20 to-pink-600/10 border-pink-500/30',
    green: 'from-green-500/20 to-green-600/10 border-green-500/30',
  };

  const iconColors = {
    cyan: 'text-cyan-400',
    purple: 'text-purple-400',
    pink: 'text-pink-400',
    green: 'text-green-400',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-2xl border p-6 backdrop-blur-xl hover:border-opacity-100 transition-all`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-2">{label}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          <p className="text-xs text-green-400 mt-2 flex items-center gap-1"><TrendingUp className="w-3 h-3" />{trend} from last month</p>
        </div>
        <Icon className={`w-8 h-8 ${iconColors[color]}`} />
      </div>
    </div>
  );
}

interface OrderStatusCardProps {
  status: string;
  count: number;
  color: 'yellow' | 'blue' | 'purple' | 'green';
}

function OrderStatusCard({ status, count, color }: OrderStatusCardProps) {
  const colorClasses = {
    yellow: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    blue: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    purple: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
    green: 'bg-green-500/10 border-green-500/30 text-green-400',
  };

  return (
    <div className={`rounded-lg border p-4 text-center ${colorClasses[color]} hover:border-opacity-100 transition-all`}>
      <p className="text-sm font-medium mb-2">{status}</p>
      <p className="text-2xl font-bold">{count}</p>
    </div>
  );
}

interface QuickActionCardProps {
  title: string;
  description: string;
  href: string;
  icon: any;
  color: 'cyan' | 'purple' | 'pink';
}

function QuickActionCard({ title, description, href, icon: Icon, color }: QuickActionCardProps) {
  const colorClasses = {
    cyan: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/20',
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/20',
    pink: 'from-pink-500/20 to-pink-600/10 border-pink-500/30 hover:border-pink-400/50 hover:shadow-lg hover:shadow-pink-500/20',
  };

  const iconColors = {
    cyan: 'text-cyan-400',
    purple: 'text-purple-400',
    pink: 'text-pink-400',
  };

  return (
    <Link
      href={href}
      className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl border p-6 transition-all hover:scale-105`}
    >
      <Icon className={`w-8 h-8 ${iconColors[color]} mb-3`} />
      <h3 className="text-white font-bold mb-1">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </Link>
  );
}
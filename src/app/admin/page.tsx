'use client';

import { useState, useEffect } from 'react';
import api from "@/lib/axios";

import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingBag, 
  BarChart3, 
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Sparkles,
  Bell,
  Search,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';


interface AdminLayoutProps {
  children: React.ReactNode;
}
function isAdminClient(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const token = localStorage.getItem("accessToken");
    if (!token) return false;

    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [notifications] = useState(3);
  const [stats, setStats] = useState({
  products: 0,
  orders: 0,
  users: 0,
  revenue: 0,
});
  const pathname = usePathname();
  const router = useRouter();
   
  useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await api.get("/user/me");
      setUser(res.data.user);
    } catch (err) {
      console.error("Failed to load admin user");
    }
  };

  fetchUser();
}, []);



  useEffect(() => {
    if (!isAdminClient()) {
      router.replace("/");
    }
  }, [router]);

  useEffect(() => {
  const fetchStats = async () => {
    try {
      const [productsRes, usersRes, ordersRes] = await Promise.all([
        api.get("/admin/products"),
        api.get("/admin/users/count"),
        api.get("/admin/orders/stats"),
      ]);

      setStats({
        products: productsRes.data.products.length,
        users: usersRes.data.count,
        orders: ordersRes.data.totalOrders,
        revenue: ordersRes.data.totalRevenue,
      });
    } catch (err) {
      console.error("Failed to load dashboard stats");
    }
  };

  fetchStats();
}, []);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Products', icon: Package, path: '/admin/products' },
    { name: 'Orders', icon: ShoppingBag, path: '/admin/orders' },
    { name: 'Users', icon: Users, path: '/admin/users' },
    { name: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
   
  ];

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    router.push('/login');
  };
  const getUserInitials = (name?: string) => {
    if (!name || typeof name !== 'string') {
      return 'U'; // Default for undefined name
    }
    
    // Clean up the name string and get initials
    const trimmedName = name.trim();
    if (!trimmedName) return 'U';
    
    const parts = trimmedName.split(' ');
    const initials = parts
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
    
    return initials || 'U';
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900/90 backdrop-blur-xl border-r border-cyan-500/20 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300`}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                AnimeStore
              </h1>
              <p className="text-xs text-cyan-300/70">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-white">{getUserInitials(user?.name) || 'Admin'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white truncate">{user?.name || 'Admin'}</p>
              <p className="text-xs text-cyan-400 truncate">{user?.email || 'admin@animestore.com'}</p>
              <div className="mt-1">
                <span className="inline-block px-2 py-0.5 text-xs font-semibold bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 rounded-full border border-cyan-500/30">
                  Admin
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-gray-400 hover:text-cyan-300 hover:bg-gray-800/50'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <Link
            href="/"
            className="flex items-center space-x-3 px-4 py-3 text-gray-400 hover:text-cyan-300 hover:bg-gray-800/50 rounded-lg transition-colors mb-2"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Back to Store</span>
          </Link>
          
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-3 text-gray-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-md border-b border-cyan-500/20">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div className="hidden md:block">
                <h2 className="text-lg font-semibold text-white">
                  {menuItems.find(item => item.path === pathname)?.name || 'Dashboard'}
                </h2>
                <p className="text-xs text-cyan-300/70">Admin Dashboard</p>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden md:block relative group">
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-gray-800/50 border border-cyan-500/30 rounded-full pl-10 pr-4 py-2 w-64 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 text-sm"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-cyan-400" />
              </div>

              {/* Notifications */}
              <button className="relative p-2 hover:bg-gray-800/50 rounded-lg transition-colors group">
                <Bell className="w-5 h-5 text-gray-400 group-hover:text-cyan-400" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {notifications}
                  </span>
                )}
              </button>

              {/* Quick Actions */}
              <div className="relative group">
                <button className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-lg hover:border-cyan-400 transition-colors">
                  <span className="text-sm font-semibold text-cyan-300">Quick Actions</span>
                  <ChevronDown className="w-4 h-4 text-cyan-400" />
                </button>
                
                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-xl rounded-xl border border-cyan-500/20 shadow-2xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <Link
                    href="/admin/products/new"
                    className="block px-4 py-3 text-sm text-gray-300 hover:text-cyan-300 hover:bg-gray-800/50 transition-colors"
                  >
                    Add New Product
                  </Link>
                  <Link
                    href="/admin/orders/new"
                    className="block px-4 py-3 text-sm text-gray-300 hover:text-cyan-300 hover:bg-gray-800/50 transition-colors"
                  >
                    Process Order
                  </Link>
                  <div className="border-t border-gray-800">
                    <Link
                      href="/admin/settings"
                      className="block px-4 py-3 text-sm text-gray-300 hover:text-cyan-300 hover:bg-gray-800/50 transition-colors"
                    >
                      Settings
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-4 md:p-6">
          {/* Stats Cards */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 border border-cyan-500/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Products</p>
                  <p className="text-2xl font-bold text-white">{stats.products}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
              <div className="mt-2 text-xs text-green-400">+12% from last month</div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 border border-purple-500/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Orders</p>
                  <p className="text-2xl font-bold text-white">{stats.orders}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <div className="mt-2 text-xs text-green-400">+8% from last month</div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 border border-pink-500/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active Users</p>
                  <p className="text-2xl font-bold text-white">{stats.orders}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500/20 to-pink-600/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-pink-400" />
                </div>
              </div>
              <div className="mt-2 text-xs text-green-400">+5% from last month</div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 border border-green-500/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Revenue</p>
                 <p className="text-2xl font-bold text-white">₹{stats.revenue}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-green-400" />
                </div>
              </div>
              <div className="mt-2 text-xs text-green-400">+15% from last month</div>
            </div>
          </div>

          {/* Page Content */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-cyan-500/20 overflow-hidden">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
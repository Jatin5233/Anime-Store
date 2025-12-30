"use client";

import {
  ShoppingCart,
  Search,
  Menu,
  X,
  Sparkles,
  User,
  LogIn,
  LogOut,
  UserCircle,
  ChevronDown,
  Home,
  Package,
  Heart,
  Settings,
  BarChart3,
  Bell,
  Zap,
  Shield,
  Check,
  AlertCircle
} from "lucide-react";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { getAccessToken, clearAuth } from "@/lib/authClient";
import { getCartCount } from "@/lib/cartClient";
import { useCartStore } from "@/store/cartStore";
interface UserData {
  name?: string;
  email?: string;
  role?: "user" | "admin";
  isVerified?: boolean;
}

export function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<UserData | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notifications] = useState(3);
const totalItems = useCartStore((state) =>
  state.items.reduce((sum, item) => sum + item.quantity, 0)
);
  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Collections", href: "/collections", icon: Package },
    { label: "KeyChains", href: "/keychains", icon: Zap },
    { label: "Gift-Items", href: "/gift-items", icon: Bell },
    { label: "Others", href: "/others", icon: Sparkles },
  ];

  /* -------------------- AUTH CHECK -------------------- */
  useEffect(() => {
    const init = async () => {
      try {
        // Get cart count from centralized client
        setCartCount(getCartCount());

        const token = getAccessToken();
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await fetch("/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();
        setUser(data.user);
      } catch {
        clearAuth();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    init();

    // Listen for cart updates
    const handleCartUpdate = () => {
      setCartCount(getCartCount());
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  /* -------------------- HELPERS -------------------- */
  const getUserInitials = (name?: string) => {
    if (!name || typeof name !== "string") return "U";
    
    const trimmedName = name.trim();
    if (!trimmedName) return "U";
    
    const parts = trimmedName.split(" ");
    const initials = parts
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
    
    return initials || "U";
  };

  const getFirstName = (name?: string) => {
    if (!name || typeof name !== "string") return "User";
    const trimmedName = name.trim();
    const parts = trimmedName.split(" ");
    return parts[0] || "User";
  };

  const logout = () => {
    clearAuth();
    setUser(null);
    setIsDropdownOpen(false);
    router.push("/");
  };

  /* -------------------- RENDER -------------------- */
  return (
    <header className="sticky top-0 z-50 border-b border-cyan-500/20 bg-gray-950/90 backdrop-blur-md">
      {/* Top Glow Bar */}
      <div className="h-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"></div>

      <div className="mx-auto max-w-[1440px] px-4 lg:px-6">

        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 md:gap-3">
            <div className="relative">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 md:w-7 md:h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-pink-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <div className="text-lg md:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                AnimeStore
              </div>
              <div className="text-[10px] md:text-xs text-cyan-300/70 font-mono hidden sm:block">
                CYBERPUNK COLLECTIBLES
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 flex-1 justify-center">

            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative group"
                >
                  <div className={`flex items-center gap-2 text-xs uppercase font-semibold tracking-wider transition-colors ${
                    isActive
                      ? "text-cyan-300"
                      : "text-gray-300 hover:text-cyan-300"
                  }`}>
                    <item.icon className="w-3 h-3 md:w-4 md:h-4" />
                    <span>{item.label}</span>
                  </div>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
              );
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3 shrink-0">


            {/* Search */}
            

            {/* Authentication Section */}
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-gray-800 animate-pulse"></div>
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 md:p-2 rounded-lg hover:bg-gray-800/50 transition-colors group"
                >
                  <div className="relative">
                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                      <span className="text-xs md:text-sm font-bold text-white">
                        {getUserInitials(user.name)}
                      </span>
                    </div>
                    {user.isVerified && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                    )}
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-xs font-semibold text-cyan-300 truncate max-w-[100px]">
                      {getFirstName(user.name)}
                    </div>
                    <div className="text-[10px] text-gray-400">
                      {user.role === "admin" ? "Admin" : "Collector"}
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 md:w-56 bg-gray-900/95 backdrop-blur-xl rounded-xl border border-cyan-500/20 shadow-2xl overflow-hidden z-50">
                    <div className="p-4 border-b border-gray-800">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                          <span className="text-sm font-bold text-white">
                            {getUserInitials(user.name)}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-white truncate">
                            {user.name || "User"}
                          </div>
                          <div className="text-xs text-cyan-400 truncate">
                            {user.email || "user@example.com"}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <div className="text-xs px-2 py-0.5 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 rounded-full border border-cyan-500/30">
                              {user.role || "user"}
                            </div>
                            {user.isVerified && (
                              <div className="text-xs px-2 py-0.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 rounded-full border border-green-500/30">
                                Verified
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-2">
                      <Link
                        href="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="dropdown-item-hover"
                      >
                        <UserCircle className="w-4 h-4" />
                        <span>My Profile</span>
                      </Link>
                      
                      <Link
                        href="/wishlist"
                        onClick={() => setIsDropdownOpen(false)}
                        className="dropdown-item-hover text-pink-300 hover:text-pink-200"
                      >
                        <Heart className="w-4 h-4" />
                        <span>My Wishlist</span>
                      </Link>
                      
                      <Link
                        href="/orders"
                        onClick={() => setIsDropdownOpen(false)}
                        className="dropdown-item-hover text-purple-300 hover:text-purple-200"
                      >
                        <Package className="w-4 h-4" />
                        <span>My Orders</span>
                      </Link>
                      
                      {user.role === "admin" && (
                        <Link
                          href="/admin"
                          onClick={() => setIsDropdownOpen(false)}
                          className="dropdown-item-hover text-yellow-300 hover:text-yellow-200"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}
                    </div>
                    
                    <div className="p-2 border-t border-gray-800">
                      <button
                        onClick={logout}
                        className="dropdown-item-hover text-red-300 hover:text-red-200 hover:bg-red-500/10"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2 shrink-0">

                <Link
                  href="/login"
                  className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-cyan-300 hover:text-cyan-200 hover:bg-cyan-500/10 rounded-lg transition-colors border border-cyan-500/30"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg hover:opacity-90 transition-opacity"
                >
                  <User className="w-4 h-4" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 hover:bg-gray-800/50 rounded-lg transition-colors group"
            >
              <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-cyan-300 group-hover:text-cyan-400" />
              {totalItems > 0 && (
        <span className="cart-badge">
          {totalItems}
        </span>
      )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5 md:w-6 md:h-6" /> : <Menu className="w-5 h-5 md:w-6 md:h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-800">
            <div className="space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 font-semibold text-gray-300 hover:text-cyan-300 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
              
              {/* Mobile Authentication Links */}
              {!user && (
                <>
                  <div className="pt-4 border-t border-gray-800">
                    <Link
                      href="/login"
                      className="block w-full text-center py-2.5 text-sm font-semibold text-cyan-300 hover:text-cyan-200 hover:bg-cyan-500/10 rounded-lg transition-colors border border-cyan-500/30 mb-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="block w-full text-center py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg hover:opacity-90 transition-opacity"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                </>
              )}
              
              {user && (
                <>
                  <div className="pt-4 border-t border-gray-800">
                    <div className="flex items-center gap-3 mb-4 p-3 bg-gray-800/30 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-white">
                          {getUserInitials(user.name)}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-white">{getFirstName(user.name)}</div>
                        <div className="text-xs text-cyan-400">View Profile</div>
                      </div>
                    </div>
                    
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 p-3 text-gray-300 hover:text-cyan-300 hover:bg-gray-800/50 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <UserCircle className="w-4 h-4" />
                      <span>My Profile</span>
                    </Link>
                    
                    <Link
                      href="/wishlist"
                      className="flex items-center gap-3 p-3 text-gray-300 hover:text-pink-300 hover:bg-gray-800/50 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Heart className="w-4 h-4" />
                      <span>Wishlist</span>
                    </Link>
                    
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-3 w-full p-3 text-gray-300 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}

              {/* Mobile Search */}
              <div className="relative pt-4 border-t border-gray-800">
                <input
                  type="text"
                  placeholder="Search collectibles..."
                  className="w-full bg-gray-900/80 border border-cyan-500/30 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:border-cyan-400 text-sm"
                />
                <Search className="absolute left-3 top-6 w-4 h-4 text-cyan-400" />
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Close dropdown when clicking outside */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </header>
  );
}
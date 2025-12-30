"use client";

import { useState } from "react";
import { loginUser } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, Sparkles, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser({ email, password });

      // Store access token (refresh token is set as httpOnly cookie by server)
      localStorage.setItem("accessToken", data.accessToken);

      // Optional: Store remember me preference
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      }

      // If user had items in localStorage cart (from before login), merge them into server-side cart
      try {
        const guestCart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (Array.isArray(guestCart) && guestCart.length > 0) {
          for (const item of guestCart) {
            await fetch('/api/cart/add', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${data.accessToken}`,
              },
              body: JSON.stringify({ productId: item._id, quantity: item.quantity || 1 }),
            });
          }
          // clear guest cart after merge
          localStorage.removeItem('cart');
          window.dispatchEvent(new CustomEvent('cartUpdated'));
        }
      } catch (err) {
        console.error('Failed to merge guest cart after login', err);
      }

      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative w-full max-w-md">
      {/* Animated Background Effects */}
      <div className="absolute -inset-4 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl blur-xl"></div>
      <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl"></div>

      <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-cyan-500/20 shadow-2xl overflow-hidden">
        {/* Top Glow Bar */}
        <div className="h-1.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"></div>

        {/* Header */}
        <div className="p-8 border-b border-gray-800">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Access Collection
          </h1>
          <p className="text-center text-cyan-300/70 text-sm">
            Enter your credentials to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/30 rounded-lg flex items-center space-x-3 animate-pulse">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span className="text-sm text-red-300">{error}</span>
            </div>
          )}

          <div className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 flex items-center">
                <Mail className="w-4 h-4 mr-2 text-cyan-400" />
                Email Address
              </label>
              <input
                type="email"
                placeholder="collector@neon.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-800/50 border border-cyan-500/30 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 text-white placeholder-gray-500 transition-all duration-300"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-gray-300 flex items-center">
                  <Lock className="w-4 h-4 mr-2 text-cyan-400" />
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center"
                >
                  {showPassword ? (
                    <>
                      <EyeOff className="w-4 h-4 mr-1" />
                      Hide
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-1" />
                      Show
                    </>
                  )}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-gray-800/50 border border-cyan-500/30 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 text-white placeholder-gray-500 pr-12 transition-all duration-300"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className={`w-2 h-2 rounded-full ${password.length >= 6 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                </div>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border group-hover:border-cyan-400 transition-colors ${
                    rememberMe 
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-600 border-transparent' 
                      : 'border-cyan-500/30 bg-gray-800/50'
                  } flex items-center justify-center transition-all duration-300`}>
                    {rememberMe && (
                      <div className="w-2 h-2 bg-white rounded-sm"></div>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-300 group-hover:text-gray-200 transition-colors">
                  Remember me
                </span>
              </label>
              
              <Link
                href="/auth/forgot-password"
                className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg font-bold text-white hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
            >
              <div className="relative z-10 flex items-center justify-center">
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  'Sign In to Collection'
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-500">New to AnimeStore?</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <Link
                href="/auth/signup"
                className="inline-block w-full py-3 border-2 border-cyan-500/30 text-cyan-300 rounded-lg font-semibold hover:border-cyan-400 hover:text-cyan-200 hover:bg-cyan-500/10 transition-all duration-300"
              >
                Create New Account
              </Link>
            </div>
          </div>
        </form>

        {/* Footer Links */}
        <div className="p-4 bg-gray-900/50 border-t border-gray-800">
          <div className="flex items-center justify-center space-x-6 text-sm">
            <Link
              href="/"
              className="text-gray-400 hover:text-cyan-300 transition-colors flex items-center"
            >
              ← Back to Store
            </Link>
            <div className="text-gray-600">|</div>
            <Link
              href="/support"
              className="text-gray-400 hover:text-cyan-300 transition-colors"
            >
              Support Center
            </Link>
          </div>
        </div>
      </div>

     
      
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { registerUser } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User, Sparkles, AlertCircle, Loader2, Check, Key, Shield, Zap } from "lucide-react";
import Link from "next/link";

export default function RegisterForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Password strength checker
  useEffect(() => {
    const calculateStrength = (pass: string) => {
      let strength = 0;
      if (pass.length >= 8) strength += 25;
      if (/[A-Z]/.test(pass)) strength += 25;
      if (/[a-z]/.test(pass)) strength += 25;
      if (/[0-9]/.test(pass)) strength += 15;
      if (/[^A-Za-z0-9]/.test(pass)) strength += 10;
      return Math.min(strength, 100);
    };

    setPasswordStrength(calculateStrength(formData.password));
  }, [formData.password]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (!termsAccepted) {
      setError("Please accept the terms and conditions");
      return;
    }
    
    if (passwordStrength < 50) {
      setError("Please use a stronger password");
      return;
    }

    setLoading(true);

    try {
      await registerUser({ 
        name: formData.name, 
        email: formData.email, 
        password: formData.password 
      });
      
      // Optional: Show success message before redirect
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const getStrengthColor = () => {
    if (passwordStrength < 30) return "from-red-500 to-red-600";
    if (passwordStrength < 60) return "from-yellow-500 to-orange-600";
    if (passwordStrength < 80) return "from-cyan-500 to-blue-600";
    return "from-green-500 to-emerald-600";
  };

  const getStrengthText = () => {
    if (passwordStrength < 30) return "Weak";
    if (passwordStrength < 60) return "Fair";
    if (passwordStrength < 80) return "Good";
    return "Strong";
  };

  return (
    <div className="relative w-full max-w-lg">
      {/* Animated Background Effects */}
      <div className="absolute -inset-4 bg-gradient-to-br from-pink-500/5 via-purple-500/5 to-cyan-500/5 rounded-3xl blur-xl"></div>
      <div className="absolute top-0 left-0 w-40 h-40 bg-pink-500/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl"></div>

      <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-purple-500/20 shadow-2xl overflow-hidden">
        {/* Top Glow Bar */}
        <div className="h-1.5 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500"></div>

        {/* Header */}
        <div className="p-8 border-b border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Key className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  Join AnimeStore
                </h1>
                <p className="text-sm text-cyan-300/70">Become a collector today</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full border border-cyan-500/20">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-semibold text-cyan-300">SECURE</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-800/30 rounded-lg">
              <div className="text-lg font-bold text-cyan-400">500+</div>
              <div className="text-xs text-gray-400">Collectors</div>
            </div>
            <div className="text-center p-3 bg-gray-800/30 rounded-lg">
              <div className="text-lg font-bold text-purple-400">42</div>
              <div className="text-xs text-gray-400">Exclusive Drops</div>
            </div>
            <div className="text-center p-3 bg-gray-800/30 rounded-lg">
              <div className="text-lg font-bold text-pink-400">24/7</div>
              <div className="text-xs text-gray-400">Support</div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-gradient-to-r from-pink-500/10 to-red-500/10 border border-pink-500/30 rounded-lg flex items-start space-x-3 animate-pulse">
              <AlertCircle className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-pink-300">{error}</span>
            </div>
          )}

          <div className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 flex items-center">
                <User className="w-4 h-4 mr-2 text-cyan-400" />
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                minLength={2}
                className="w-full bg-gray-800/50 border border-cyan-500/30 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 text-white placeholder-gray-500 transition-all duration-300"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 flex items-center">
                <Mail className="w-4 h-4 mr-2 text-purple-400" />
                Email Address
              </label>
              <input
                type="email"
                placeholder="collector@neon.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                className="w-full bg-gray-800/50 border border-purple-500/30 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 text-white placeholder-gray-500 transition-all duration-300"
              />
            </div>

            {/* Password Field with Strength Indicator */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-gray-300 flex items-center">
                  <Lock className="w-4 h-4 mr-2 text-pink-400" />
                  Password
                </label>
                <div className="flex items-center space-x-2">
                  <div className="text-xs text-gray-400">{getStrengthText()}</div>
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getStrengthColor()}`}></div>
                </div>
              </div>
              
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  minLength={8}
                  className="w-full bg-gray-800/50 border border-pink-500/30 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400/50 text-white placeholder-gray-500 pr-12 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-pink-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password Strength Bar */}
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${getStrengthColor()} transition-all duration-500`}
                  style={{ width: `${passwordStrength}%` }}
                ></div>
              </div>
              
              {/* Password Requirements */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className={`flex items-center space-x-2 ${formData.password.length >= 8 ? 'text-green-400' : 'text-gray-500'}`}>
                  <div className={`w-2 h-2 rounded-full ${formData.password.length >= 8 ? 'bg-green-500' : 'bg-gray-700'}`}></div>
                  <span>8+ characters</span>
                </div>
                <div className={`flex items-center space-x-2 ${/[A-Z]/.test(formData.password) ? 'text-green-400' : 'text-gray-500'}`}>
                  <div className={`w-2 h-2 rounded-full ${/[A-Z]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-700'}`}></div>
                  <span>Uppercase letter</span>
                </div>
                <div className={`flex items-center space-x-2 ${/[a-z]/.test(formData.password) ? 'text-green-400' : 'text-gray-500'}`}>
                  <div className={`w-2 h-2 rounded-full ${/[a-z]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-700'}`}></div>
                  <span>Lowercase letter</span>
                </div>
                <div className={`flex items-center space-x-2 ${/[0-9]/.test(formData.password) ? 'text-green-400' : 'text-gray-500'}`}>
                  <div className={`w-2 h-2 rounded-full ${/[0-9]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-700'}`}></div>
                  <span>Number</span>
                </div>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-gray-300 flex items-center">
                  <Lock className="w-4 h-4 mr-2 text-purple-400" />
                  Confirm Password
                </label>
                {formData.password && formData.confirmPassword && (
                  <div className={`flex items-center space-x-1 text-xs ${formData.password === formData.confirmPassword ? 'text-green-400' : 'text-pink-400'}`}>
                    {formData.password === formData.confirmPassword ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Passwords match</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3 h-3" />
                        <span>No match</span>
                      </>
                    )}
                  </div>
                )}
              </div>
              
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  required
                  className={`w-full bg-gray-800/50 border rounded-lg px-4 py-3 focus:outline-none focus:ring-1 text-white placeholder-gray-500 pr-12 transition-all duration-300 ${
                    formData.confirmPassword 
                      ? formData.password === formData.confirmPassword
                        ? 'border-green-500/50 focus:border-green-400 focus:ring-green-400/50'
                        : 'border-pink-500/50 focus:border-pink-400 focus:ring-pink-400/50'
                      : 'border-purple-500/30 focus:border-purple-400 focus:ring-purple-400/50'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Terms and Conditions */}
            <label className="flex items-start space-x-3 cursor-pointer group">
              <div className="relative mt-0.5">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border group-hover:border-cyan-400 transition-colors ${
                  termsAccepted 
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 border-transparent' 
                    : 'border-cyan-500/30 bg-gray-800/50'
                } flex items-center justify-center transition-all duration-300`}>
                  {termsAccepted && <Check className="w-3 h-3 text-white" />}
                </div>
              </div>
              <div className="text-sm text-gray-300 group-hover:text-gray-200 transition-colors">
                I agree to the{' '}
                <Link href="/terms" className="text-cyan-400 hover:text-cyan-300 underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-cyan-400 hover:text-cyan-300 underline">
                  Privacy Policy
                </Link>
              </div>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !termsAccepted}
              className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg font-bold text-white hover:shadow-[0_0_30px_rgba(255,0,255,0.5)] transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
            >
              <div className="relative z-10 flex items-center justify-center">
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Join AnimeStore
                  </>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-500">Already have an account?</span>
              </div>
            </div>

            {/* Sign In Link */}
            <div className="text-center">
              <Link
                href="/login"
                className="inline-block w-full py-3 border-2 border-cyan-500/30 text-cyan-300 rounded-lg font-semibold hover:border-cyan-400 hover:text-cyan-200 hover:bg-cyan-500/10 transition-all duration-300"
              >
                Sign In to Existing Account
              </Link>
            </div>
          </div>
        </form>

        {/* Footer Links */}
        <div className="p-4 bg-gray-900/50 border-t border-gray-800">
          <div className="flex items-center justify-between text-sm">
            <Link
              href="/"
              className="text-gray-400 hover:text-cyan-300 transition-colors flex items-center"
            >
              ← Back to Store
            </Link>
            <div className="flex items-center space-x-1">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-xs">Encrypted Connection</span>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-900/30 rounded-xl border border-cyan-500/10 backdrop-blur-sm">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-sm font-semibold text-cyan-300">Early Access</div>
          </div>
          <p className="text-xs text-gray-400">Get notified of new drops 24h before public</p>
        </div>
        
        <div className="p-4 bg-gray-900/30 rounded-xl border border-purple-500/10 backdrop-blur-sm">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-sm font-semibold text-purple-300">Verified Status</div>
          </div>
          <p className="text-xs text-gray-400">Holographic certification for all purchases</p>
        </div>
        
        <div className="p-4 bg-gray-900/30 rounded-xl border border-pink-500/10 backdrop-blur-sm">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500/20 to-pink-600/20 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-pink-400" />
            </div>
            <div className="text-sm font-semibold text-pink-300">Exclusive Rewards</div>
          </div>
          <p className="text-xs text-gray-400">Earn points for every purchase</p>
        </div>
      </div>
    </div>
  );
}
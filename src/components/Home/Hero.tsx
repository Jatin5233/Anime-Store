'use client';

import { useState } from 'react';
import { Sparkles, Zap, ArrowRight, TrendingUp, Star, Play, Target, Users, Clock, Shield } from 'lucide-react';

interface HeroSectionProps {
  wishlist: number[];
  toggleWishlist: (id: number) => void;
}

export function HeroSection() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    { id: 1, icon: <Shield className="w-5 h-5" />, title: "Authentic", desc: "100% Official Merch" },
    { id: 2, icon: <Target className="w-5 h-5" />, title: "Limited", desc: "Exclusive Drops" },
    { id: 3, icon: <Clock className="w-5 h-5" />, title: "Fast", desc: "24h Shipping" },
    { id: 4, icon: <Users className="w-5 h-5" />, title: "Community", desc: "10K+ Collectors" },
  ];

  const featuredProducts = [
    { id: 1, name: "Neon Rider", edition: "Ultimate", price: "₹129", tag: "Hot", discount: "-20%", color: "from-cyan-500 to-blue-600" },
    { id: 2, name: "Cyber Kunoichi", edition: "EX", price: "₹99", tag: "New", discount: "-15%", color: "from-purple-500 to-pink-600" },
    { id: 3, name: "Mecha Titan", edition: "Limited", price: "₹149", tag: "Rare", discount: "-25%", color: "from-orange-500 to-red-600" },
  ];

  return (
    <div className="relative w-full overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-20 bg-[size:50px_50px] bg-[linear-gradient(to_right,#0ea5e940_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e940_1px,transparent_1px)]" />
        
        {/* Animated Orbs */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-gradient-to-r from-cyan-500/20 to-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500" />
        
        {/* Scan Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[size:100%_4px]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12 md:py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Left Content - Enhanced */}
          <div className="relative space-y-6 md:space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/15 to-purple-500/10 border border-cyan-500/30 rounded-full backdrop-blur-sm">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
              <span className="text-sm font-semibold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
                🔥 LIMITED DROP LIVE • ENDS IN 24H
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight tracking-tight">
                <span className="block bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                  CYBERPUNK
                </span>
                <span className="block bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent mt-2">
                  COLLECTIBLES
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl lg:text-3xl text-gray-300 font-light max-w-2xl">
                Where <span className="text-cyan-300 font-semibold">neon dreams</span> meet{' '}
                <span className="text-purple-300 font-semibold">tangible art</span>
              </p>
            </div>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl">
              Premium limited-edition anime figures with RGB lighting, holographic certification, 
              and blockchain-verified authenticity. Each piece tells a story in the cyberpunk universe.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  onMouseEnter={() => setHoveredFeature(feature.id)}
                  onMouseLeave={() => setHoveredFeature(null)}
                 className={`p-3 md:p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 ${
                    hoveredFeature === feature.id
                      ? 'border-cyan-500/50 bg-gradient-to-br from-cyan-500/10 to-transparent scale-105'
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-2">
  <div className={`p-1.5 md:p-2 rounded-lg ${
                      hoveredFeature === feature.id
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'bg-white/5 text-gray-400'
                    }`}>
                      {feature.icon}
                    </div>
                    <span className="font-bold text-white">{feature.title}</span>
                  </div>
                  <p className="text-sm text-gray-400">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="group relative px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-xl font-bold text-sm md:text-lg uppercase tracking-wider overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(0,240,255,0.3)]">
                <span className="relative z-10 flex items-center justify-center gap-2 md:gap-3">
  <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
  <span className="hidden sm:inline">EXPLORE COLLECTION</span>
  <span className="sm:hidden">EXPLORE</span>
  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-xl group-hover:opacity-100 opacity-0 transition-opacity" />
              </button>

              <button className="px-6 md:px-8 py-3 md:py-4 border-2 border-cyan-400/30 text-cyan-300 rounded-xl font-bold text-sm md:text-lg uppercase tracking-wider hover:bg-cyan-400/10 hover:border-cyan-400/50 transition-all duration-300 group">
  <span className="flex items-center justify-center gap-2 md:gap-3">
    <Play className="w-4 h-4 md:w-5 md:h-5" />
    <span className="hidden sm:inline">WATCH TRAILER</span>
    <span className="sm:hidden">TRAILER</span>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full group-hover:animate-pulse" />
                </span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 md:gap-6 pt-6 md:pt-8">
              <div className="text-center">
  <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-cyan-300 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
    <TrendingUp className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                  500+
                </div>
                <div className="text-xs md:text-sm text-gray-400 mt-1">Unique Collectibles</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-purple-300 flex items-center gap-2">
                  <Star className="w-6 h-6" />
                  4.9
                </div>
                <div className="text-sm text-gray-400 mt-1">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-pink-300 flex items-center gap-2">
                  <Zap className="w-6 h-6" />
                  24h
                </div>
                <div className="text-sm text-gray-400 mt-1">Flash Sales</div>
              </div>
            </div>
          </div>

          {/* Right Content - Full Width Showcase */}
          <div className="relative w-full">
  <div className="relative w-full min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] pb-24 sm:pb-32">
              {/* Main Featured Card */}
              <div className="relative w-full h-full bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-black rounded-3xl overflow-hidden border border-cyan-500/20 shadow-2xl">
                <div className="absolute inset-0">
                  {/* Animated Background Pattern */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,240,255,0.1),transparent_50%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,45,149,0.1),transparent_50%)]" />
                  
                  {/* Circuit Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <svg width="100%" height="100%" className="absolute inset-0">
                      <path d="M0,100 Q50,0 100,100 T200,100" stroke="rgba(0,240,255,0.3)" strokeWidth="1" fill="none" />
                      <path d="M0,200 Q50,100 100,200 T200,200" stroke="rgba(255,45,149,0.3)" strokeWidth="1" fill="none" />
                    </svg>
                  </div>
                </div>

                {/* Product Display */}
                <div className="relative w-full p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col">
                  {/* Product Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 sm:mb-8">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full mb-4">
                        <span className="text-sm font-bold text-cyan-300">#1 TRENDING</span>
                      </div>
                     <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                        NEON RIDER <span className="text-cyan-300">ULTIMATE</span>
                      </h3>
                      <p className="text-sm md:text-base text-gray-400 mt-2">Fully articulated with 32 LED points</p>
                    </div>
                    <div className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-bold text-white shadow-lg">
                      LIMITED
                    </div>
                  </div>

                  {/* Product Visualization */}
                 <div className="flex items-center justify-center my-6 sm:my-8">
  <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80">
                      {/* Glowing Orb */}
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-full blur-3xl animate-pulse" />
                      
                      {/* Product Silhouette */}
                      <div className="relative w-full h-full">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/40 to-purple-500/40 rounded-full animate-spin-slow" />
                        <div className="absolute inset-8 bg-gradient-to-tr from-cyan-600/60 to-blue-600/60 rounded-full animate-pulse delay-300" />
                        <div className="absolute inset-16 bg-gradient-to-br from-purple-600/40 to-pink-600/40 rounded-full animate-pulse delay-700" />
                      </div>
                      
                      {/* Floating Elements */}
                      <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl rotate-12 animate-float" />
                      <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl -rotate-12 animate-float delay-1000" />
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="space-y-6">
                    {/* Price & Stock */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-cyan-300">₹129</div>
<div className="text-sm md:text-base text-gray-400 line-through">₹159</div>
                      </div>
                     <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
  <div className="px-3 sm:px-4 py-2 bg-cyan-500/10 text-cyan-300 rounded-lg border border-cyan-500/30 text-xs sm:text-sm text-center">
    Ships Worldwide
  </div>
  <button className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-bold text-sm sm:text-base hover:opacity-90 transition-opacity whitespace-nowrap">
    PRE-ORDER NOW
  </button>
</div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-cyan-300">Stock: 15/50 remaining</span>
                        <span className="text-gray-400">30% sold</span>
                      </div>
                      <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 w-1/3 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Product Cards */}
              <div className="absolute -bottom-20 sm:-bottom-24 left-4 sm:left-6 right-4 sm:right-auto">
  <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-4 no-scrollbar">
                  {featuredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="min-w-[120px] sm:min-w-[128px] h-36 sm:h-40 bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-white/10 p-4 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-2"
                    >
                      <div className={`w-full h-16 mb-3 bg-gradient-to-r ${product.color} rounded-lg flex items-center justify-center`}>
                        <span className="text-black font-bold text-xs">{product.name}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs text-gray-400">{product.edition} Edition</div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-white">{product.price}</span>
                          <span className="text-xs px-2 py-0.5 bg-pink-500/20 text-pink-300 rounded">
                            {product.tag}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-950 to-transparent z-0" />

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
          @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  
  .animate-spin-slow {
    animation: spin-slow 20s linear infinite;
  }
  
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
      `}</style>
    </div>
  );
}
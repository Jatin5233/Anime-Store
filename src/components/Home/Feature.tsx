'use client';

import { Shield, Truck, Zap, Clock } from 'lucide-react';

export function FeaturesSection() {
  return (
    <section className="py-12 md:py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
          <span className="bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
            Why Choose AnimeStore
          </span>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <div className="text-center group">
            <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Shield className="w-7 h-7 md:w-8 md:h-8 text-white" />
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-cyan-300">Authentic Guarantee</h3>
            <p className="text-sm md:text-base text-gray-400">100% official merchandise with holographic certification</p>
          </div>
          
          <div className="text-center group">
            <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Truck className="w-7 h-7 md:w-8 md:h-8 text-white" />
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-purple-300">Global Shipping</h3>
            <p className="text-sm md:text-base text-gray-400">Secure delivery worldwide with real-time tracking</p>
          </div>
          
          <div className="text-center group">
            <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Zap className="w-7 h-7 md:w-8 md:h-8 text-white" />
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-pink-300">LED Features</h3>
            <p className="text-sm md:text-base text-gray-400">Premium lighting systems with custom RGB controls</p>
          </div>
          
          <div className="text-center group">
            <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-7 h-7 md:w-8 md:h-8 text-white" />
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-blue-300">24/7 Support</h3>
            <p className="text-sm md:text-base text-gray-400">Round-the-clock customer service and assistance</p>
          </div>
        </div>
      </div>
    </section>
  );
}
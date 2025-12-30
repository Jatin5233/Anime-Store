'use client';

import { Sparkles } from 'lucide-react';

export function Footer() {
  const shopLinks = ['All Figures', 'New Arrivals', 'Pre-orders', 'Limited Edition', 'Best Sellers', 'Sale'];
  const companyLinks = ['About Us', 'Blog', 'Careers', 'Press', 'Affiliates'];

  return (
    <footer className="border-t border-gray-800 py-8 md:py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Logo and Description */}
          <div>
            <div className="flex items-center space-x-2 md:space-x-3 mb-4 md:mb-6">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <div className="text-lg md:text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  AnimeStore
                </div>
                <div className="text-[10px] md:text-xs text-cyan-300/70">Cyberpunk Collectibles</div>
              </div>
            </div>
            <p className="text-gray-400 text-xs md:text-sm">
              Premium anime figures and collectibles for the discerning cyberpunk enthusiast.
              Limited editions, exclusive drops, and unparalleled quality.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base md:text-lg font-bold mb-3 md:mb-4 text-cyan-300">Shop</h4>
            <ul className="space-y-1.5 md:space-y-2">
              {shopLinks.map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-cyan-300 transition-colors text-xs md:text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-base md:text-lg font-bold mb-3 md:mb-4 text-purple-300">Company</h4>
            <ul className="space-y-1.5 md:space-y-2">
              {companyLinks.map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-purple-300 transition-colors text-xs md:text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-base md:text-lg font-bold mb-3 md:mb-4 text-pink-300">Stay Updated</h4>
            <p className="text-gray-400 text-xs md:text-sm mb-3 md:mb-4">
              Get early access to new drops and exclusive offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-gray-900 border border-cyan-500/30 rounded-lg px-3 md:px-4 py-2 focus:outline-none focus:border-cyan-400 text-xs md:text-sm"
              />
              <button className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity py-2 text-xs md:text-sm">
                Join
              </button>
            </div>
            <p className="text-gray-500 text-[10px] md:text-xs mt-2 md:mt-3">
              By subscribing, you agree to our Privacy Policy
            </p>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 mt-6 md:mt-8 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-500 text-xs md:text-sm text-center md:text-left">
            © {new Date().getFullYear()} AnimeStore. All rights reserved.
          </div>
          <div className="flex items-center flex-wrap justify-center gap-3 md:gap-6">
            <a href="#" className="text-gray-400 hover:text-cyan-300 transition-colors text-xs md:text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-cyan-300 transition-colors text-xs md:text-sm">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-cyan-300 transition-colors text-xs md:text-sm">Cookie Policy</a>
            <a href="#" className="text-gray-400 hover:text-cyan-300 transition-colors text-xs md:text-sm">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
'use client';

import { Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  const shopLinks = ['All Figures', 'New Arrivals', 'Pre-orders', 'Limited Edition', 'Best Sellers', 'Sale'];
  const supportLinks = ['Shipping Info', 'Returns', 'FAQ', 'Contact Us'];
  const legalLinks = ['Privacy Policy', 'Terms of Service', 'Disclaimer'];

  return (
    <footer className="border-t border-gray-800 py-12 md:py-16 px-4 bg-gradient-to-b from-gray-950 to-gray-900">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-lg md:text-xl font-bold text-white mb-4">INDISTREET</h3>
            <p className="text-gray-400 text-sm mb-6">
              Your ultimate destination for premium anime merchandise and collectibles.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <a href="mailto:Info@Indi-street.com" className="text-gray-400 hover:text-cyan-300 transition-colors text-sm">
                  Info@Indi-street.com
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <a href="tel:+919355007774" className="text-gray-400 hover:text-cyan-300 transition-colors text-sm">
                  +91 9355007774
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">India</span>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-base md:text-lg font-bold mb-4 text-white">Shop</h4>
            <ul className="space-y-2">
              {shopLinks.map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-cyan-300 transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-base md:text-lg font-bold mb-4 text-white">Support</h4>
            <ul className="space-y-2">
              {supportLinks.map((item) => (
                <li key={item}>
                  <Link href={item === 'Contact Us' ? '/contact-us' : '#'} className="text-gray-400 hover:text-cyan-300 transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-base md:text-lg font-bold mb-4 text-white">Stay Updated</h4>
            <p className="text-gray-400 text-sm mb-4">
              Get early access to new drops and exclusive offers.
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="bg-gray-800/50 border border-cyan-500/30 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-400 text-sm text-white placeholder-gray-500"
              />
              <button className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all text-sm">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-500 text-sm text-center md:text-left">
            © {new Date().getFullYear()} INDISTREET GLOBAL SERVICES PVT LTD. All rights reserved.
          </div>
          <div className="flex items-center flex-wrap justify-center gap-4 md:gap-6">
            {legalLinks.map((link) => (
              <a key={link} href="#" className="text-gray-400 hover:text-cyan-300 transition-colors text-sm">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
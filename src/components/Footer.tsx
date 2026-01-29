'use client';

import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 border-t border-cyan-500/20">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* About Company */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">INDISTREET</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium anime merchandise and collectibles for passionate fans worldwide.
            </p>
            <div className="mt-4 flex gap-4">
              <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/collections" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                  My Orders
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Get In Touch</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                <a href="mailto:Info@Indi-street.com" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm break-all">
                  Info@Indi-street.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                <a href="tel:+919355007774" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                  +91 9355007774
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                <span className="text-gray-400 text-sm">
                  India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 py-8">
          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © {currentYear} INDISTREET GLOBAL SERVICES PVT LTD. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-gray-500 hover:text-cyan-400 transition-colors text-sm">
                Terms & Conditions
              </Link>
              <Link href="#" className="text-gray-500 hover:text-cyan-400 transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-500 hover:text-cyan-400 transition-colors text-sm">
                Disclaimer
              </Link>
            </div>
          </div>
        </div>

        {/* Brand Notice */}
        <div className="text-center text-xs text-gray-600 pt-4 border-t border-gray-900">
          <p>Made with ❤️ for anime lovers worldwide</p>
        </div>
      </div>
    </footer>
  );
}

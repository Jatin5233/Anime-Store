'use client';

import { useState } from 'react';
import { Background } from '@/components/Home/Background';
import { Header } from '@/components/Home/Header';
import { HeroSection } from '@/components/Home/Hero';
import { CategoriesSection } from '@/components/Home/Categories';
import  ProductsSection  from '@/components/Home/Product';
import { FeaturesSection } from '@/components/Home/Feature';
import { Footer } from '@/components/Home/Footer';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ✅ Start clean (no dummy data)
  const [cartCount, setCartCount] = useState(0);

  // ✅ MongoDB uses string IDs
  const [wishlist, setWishlist] = useState<string[]>([]);

  // ✅ ID is string now
  const toggleWishlist = (id: string) => {
    setWishlist(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Animated Background */}
      <Background />

      <div className="relative z-10">
        <Header />

        <HeroSection />


        <CategoriesSection />

        <ProductsSection
          wishlist={wishlist}
          toggleWishlist={toggleWishlist}
          setCartCount={setCartCount}
        />

        <FeaturesSection />

        <Footer />
      </div>
    </div>
  );
}

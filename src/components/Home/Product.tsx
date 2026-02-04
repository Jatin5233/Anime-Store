"use client";

import { useEffect, useState } from "react";
import { Heart, Eye, Star, Check } from "lucide-react";
import api from "@/lib/axios";
import { useCartStore } from '@/store/cartStore';

type Product = {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  images: string[];
  stock: number;
  anime: string;
  tags: string[];
  ratings: {
    average: number;
    count: number;
  };
  isLimitedEdition: boolean;
  isPreOrder: boolean;
};

export default function ProductsSection({
  wishlist,
  toggleWishlist,
  setCartCount,
}: {
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  setCartCount: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await api.get("/products");
      // choose 4 random products for the home section
      const all = Array.isArray(res.data.products) ? res.data.products : [];
      for (let i = all.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [all[i], all[j]] = [all[j], all[i]];
      }
      setProducts(all.slice(0, 4));
    } catch (err) {
      console.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <section className="py-16 text-center text-gray-400">
        Loading products...
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 px-4 bg-gradient-to-b from-gray-950 to-gray-900/50">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
              Featured Collectibles
            </span>
          </h2>
          <p className="text-gray-400 text-sm md:text-base">Discover our most premium anime merchandise</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => {
            const tag = product.isLimitedEdition
              ? "Limited"
              : product.isPreOrder
              ? "Pre-Order"
              : product.tags?.[0] || "New";

            return (
              <div
                key={product._id}
                className="group bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-2xl overflow-hidden border border-cyan-500/20 hover:border-cyan-500/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/20 flex flex-col h-full"
              >
                {/* IMAGE CONTAINER - Enhanced */}
                <div className="relative h-56 md:h-64 bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden group/image">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover/image:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-600 bg-gray-800">
                      <Eye className="w-8 h-8" />
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300"></div>

                  {/* TAG - Enhanced */}
                  <span className={`absolute top-4 left-4 px-3 py-1.5 text-xs font-bold rounded-full border backdrop-blur-sm ${
                    tag === "Limited" 
                      ? "bg-purple-500/30 text-purple-200 border-purple-500/50"
                      : tag === "Pre-Order"
                      ? "bg-blue-500/30 text-blue-200 border-blue-500/50"
                      : "bg-cyan-500/30 text-cyan-200 border-cyan-500/50"
                  }`}>
                    {tag}
                  </span>

                  {/* WISHLIST - Enhanced */}
                  <button
                    onClick={() => toggleWishlist(product._id)}
                    className="absolute top-4 right-4 p-2.5 bg-gray-900/80 hover:bg-gray-800/90 rounded-full backdrop-blur-sm border border-gray-700/50 hover:border-pink-500/50 transition-all hover:scale-110 active:scale-95"
                    title={wishlist.includes(product._id) ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart
                      className={`w-5 h-5 transition-all ${
                        wishlist.includes(product._id)
                          ? "fill-pink-500 text-pink-500"
                          : "text-gray-400 hover:text-pink-400"
                      }`}
                    />
                  </button>
                </div>

                {/* INFO SECTION */}
                <div className="p-5 md:p-6 flex flex-col flex-1">
                  <h3 className="font-bold text-base md:text-lg mb-3 line-clamp-2 group-hover:text-cyan-300 transition-colors">
                    {product.name}
                  </h3>

                  {/* PRICE */}
                  <div className="mb-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl md:text-2xl font-bold text-white">
                        ₹{product.discountPrice || product.price}
                      </span>
                      {product.discountPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{product.price}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* RATING */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i <= Math.floor(product.ratings.average)
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-700 text-gray-700"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      {product.ratings.average.toFixed(1)} ({product.ratings.count})
                    </span>
                  </div>

                  {/* STOCK STATUS */}
                  <p className={`text-xs font-semibold mb-4 ${
                    product.stock > 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}>
                    {product.stock > 0
                      ? `✓ ${product.stock} in stock`
                      : "✗ Out of stock"}
                  </p>

                  {/* ACTIONS - Enhanced */}
                  <div className="mt-auto flex gap-2">
                    <button
                      disabled={product.stock === 0 || addedItems.has(product._id)}
                      onClick={() => {
                        const add = useCartStore.getState().addToCart;
                        add(product as any, 1);
                        
                        // Mark as added and show "Added" state
                        setAddedItems(prev => new Set([...prev, product._id]));
                        
                        // Show success notification
                        window.dispatchEvent(new CustomEvent('cartUpdated'));
                        
                        // update parent cart count if provided
                        if (typeof setCartCount === 'function') {
                          const count = useCartStore.getState().totalItems();
                          setCartCount(count);
                        }

                        // Reset "Added" state after 2 seconds
                        setTimeout(() => {
                          setAddedItems(prev => {
                            const newSet = new Set(prev);
                            newSet.delete(product._id);
                            return newSet;
                          });
                        }, 2000);
                      }}
                      className={`flex-1 py-2.5 md:py-3 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm md:text-base ${
                        product.stock === 0
                          ? "bg-gray-700/30 text-gray-500 cursor-not-allowed border border-gray-700"
                          : addedItems.has(product._id)
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/50 border border-green-400/50"
                          : "bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:shadow-lg hover:shadow-cyan-500/50 hover:-translate-y-0.5 active:translate-y-0"
                      }`}
                      title={product.stock === 0 ? "Out of stock" : "Add to cart"}
                    >
                      {addedItems.has(product._id) ? (
                        <>
                          <Check className="w-4 h-4" />
                          Added to Cart!
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1h7.586a1 1 0 00.99-.868l1.5-6A1 1 0 0015 4H5.957L5.57 2.763A1 1 0 004.6 2H3z"></path>
                            <path d="M16 16a2 2 0 11-4 0 2 2 0 014 0zM4 12a2 2 0 11-4 0 2 2 0 014 0z"></path>
                          </svg>
                          Add to Cart
                        </>
                      )}
                    </button>

                    <button className="p-2.5 md:p-3 border border-cyan-500/40 hover:border-cyan-500/80 rounded-lg text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all hover:scale-110 active:scale-95" title="Quick view">
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

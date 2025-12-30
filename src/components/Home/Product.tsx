"use client";

import { useEffect, useState } from "react";
import { Heart, Eye, Star } from "lucide-react";
import api from "@/lib/axios";

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

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await api.get("/products");
      setProducts(res.data.products);
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
    <section className="py-8 md:py-12 px-4 bg-gradient-to-b from-gray-950 to-gray-900/50">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">
          <span className="bg-gradient-to-r from-cyan-300 to-pink-300 bg-clip-text text-transparent">
            Featured Collectibles
          </span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => {
            const tag = product.isLimitedEdition
              ? "Limited"
              : product.isPreOrder
              ? "Pre-Order"
              : product.tags?.[0] || "New";

            return (
              <div
                key={product._id}
                className="group bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800 hover:border-cyan-500 transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                {/* IMAGE */}
                <div className="relative h-40 md:h-48 bg-gray-900 overflow-hidden">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                      No Image
                    </div>
                  )}

                  {/* TAG */}
                  <span className="absolute top-3 left-3 px-3 py-1 text-xs font-bold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {tag}
                  </span>

                  {/* WISHLIST */}
                  <button
                    onClick={() => toggleWishlist(product._id)}
                    className="absolute top-3 right-3 p-2 bg-gray-900/80 rounded-full"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        wishlist.includes(product._id)
                          ? "fill-pink-500 text-pink-500"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                </div>

                {/* INFO */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold mb-2 group-hover:text-cyan-300">
                    {product.name}
                  </h3>

                  <div className="mb-2">
                    <span className="text-xl font-bold">
                      ₹{product.discountPrice || product.price}
                    </span>
                    {product.discountPrice && (
                      <span className="text-sm text-gray-400 line-through ml-2">
                        ₹{product.price}
                      </span>
                    )}
                  </div>

                  {/* RATING */}
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i <= Math.floor(product.ratings.average)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-700"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-400">
                      ({product.ratings.count})
                    </span>
                  </div>

                  {/* STOCK */}
                  <p className="text-sm text-gray-400 mb-4">
                    {product.stock > 0
                      ? `${product.stock} in stock`
                      : "Out of stock"}
                  </p>

                  {/* ACTIONS */}
                  <div className="mt-auto flex gap-2">
                    <button
                      disabled={product.stock === 0}
                      onClick={() => setCartCount((p) => p + 1)}
                      className="flex-1 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold disabled:opacity-50"
                    >
                      Add to Cart
                    </button>

                    <button className="p-2 border border-cyan-500/30 rounded-lg">
                      <Eye className="w-4 h-4" />
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

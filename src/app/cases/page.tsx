'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from "@/lib/axios";

import type { Product } from '@/types/product';

import { CollectionHeader } from '@/components/Collections/CollectionHeader';
import { FilterPanel } from '@/components/Collections/FilterPanel';
import { ActiveFilters } from '@/components/Collections/ActiveFilters';
import { ProductGrid } from '@/components/Collections/ProductGrid';
import { EmptyState } from '@/components/Collections/EmptyState';
import { Header } from '@/components/Home/Header';

export default function CasesPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [filters, setFilters] = useState({
    anime: [] as string[],
    tags: [] as string[],
    category: 'cover_and_cases',
    priceRange: [0, 1000] as [number, number],
    inStock: false,
    isLimitedEdition: false,
    isPreOrder: false,
  });

  const [filterOptions, setFilterOptions] = useState({
    anime: [] as string[],
    tags: [] as string[],
    maxPrice: 1000,
  });


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const params: any = {
          category: filters.category,
          minPrice: filters.priceRange[0],
          maxPrice: filters.priceRange[1],
          inStock: filters.inStock,
          isLimitedEdition: filters.isLimitedEdition,
          isPreOrder: filters.isPreOrder,
        };

        if (filters.anime.length) {
          params.anime = filters.anime.join(",");
        }

        if (filters.tags.length) {
          params.tags = filters.tags.join(",");
        }

        const res = await api.get("/products", { params });

        setProducts(res.data.products);
        setFilterOptions(res.data.filterOptions);
      } catch (error) {
        console.error("Failed to fetch products", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);


  // Filter handlers
  const onFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleAnime = (anime: string) => {
    setFilters(prev => ({
      ...prev,
      anime: prev.anime.includes(anime)
        ? prev.anime.filter(a => a !== anime)
        : [...prev.anime, anime],
    }));
  };

  const toggleTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const clearFilters = () => {
    setFilters({
      anime: [],
      tags: [],
      category: 'cover_and_cases',
      priceRange: [0, filterOptions.maxPrice],
      inStock: false,
      isLimitedEdition: false,
      isPreOrder: false,
    });
  };


  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 z-10">
      <Header />
      <div className="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-8 py-8">
        <CollectionHeader
          title="Covers & Cases Collection"
          description="Protect your devices with stylish anime-themed covers and cases."
          stats={{
            total: products.length,
            limited: products.filter(p => p.isLimitedEdition).length,
            preOrder: products.filter(p => p.isPreOrder).length,
            newItems: products.filter(
              p => new Date(p.createdAt) > new Date(Date.now() - 7 * 86400000)
            ).length,
          }}
        />

        {/* Layout */}
        <div className="mt-8 flex gap-8">

          {/* Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-auto">
              <FilterPanel
                filters={filters}
                filterOptions={filterOptions}
                onFilterChange={onFilterChange}
                onToggleAnime={toggleAnime}
                onToggleTag={toggleTag}
                onClearFilters={clearFilters}
              />
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">

            <ActiveFilters
              filters={filters}
              onRemoveAnime={toggleAnime}
              onRemoveTag={toggleTag}
              onRemoveInStock={() => onFilterChange('inStock', false)}
              onRemoveLimitedEdition={() => onFilterChange('isLimitedEdition', false)}
              onRemovePreOrder={() => onFilterChange('isPreOrder', false)}
              onClearAll={clearFilters}
              maxPrice={filterOptions.maxPrice}
            />

            <div className="mt-6">
              <ProductGrid
                products={products}
                loading={loading}
                viewMode={viewMode}
                onProductClick={(slug) => router.push(`/product/${slug}`)}
                emptyState={<EmptyState onReset={clearFilters} />}
              />
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}

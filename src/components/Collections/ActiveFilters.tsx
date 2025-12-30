import { X, Tag, Sparkles, Clock, Package, Check } from 'lucide-react';

interface ActiveFiltersProps {
  filters: {
    anime: string[];
    tags: string[];
    priceRange: [number, number];
    inStock: boolean;
    isLimitedEdition: boolean;
    isPreOrder: boolean;
  };
  onRemoveAnime: (anime: string) => void;
  onRemoveTag: (tag: string) => void;
  onRemoveInStock: () => void;
  onRemoveLimitedEdition: () => void;
  onRemovePreOrder: () => void;
  onClearAll: () => void;
  maxPrice: number;
}

export function ActiveFilters({
  filters,
  onRemoveAnime,
  onRemoveTag,
  onRemoveInStock,
  onRemoveLimitedEdition,
  onRemovePreOrder,
  onClearAll,
  maxPrice
}: ActiveFiltersProps) {
  const hasActiveFilters = 
    filters.anime.length > 0 || 
    filters.tags.length > 0 || 
    filters.inStock || 
    filters.isLimitedEdition || 
    filters.isPreOrder ||
    filters.priceRange[0] > 0 || 
    filters.priceRange[1] < maxPrice;

  if (!hasActiveFilters) return null;

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center gap-2">
        {/* Active Filters Label */}
        <div className="mr-2">
          <span className="text-sm font-semibold text-cyan-300">Active Filters:</span>
        </div>

        {/* Anime Filters */}
        {filters.anime.map(anime => (
          <button
            key={anime}
            onClick={() => onRemoveAnime(anime)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 rounded-lg border border-cyan-500/30 text-sm hover:border-cyan-400 hover:bg-cyan-500/30 transition-all group"
          >
            <Package className="w-3 h-3" />
            <span>{anime}</span>
            <X className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}

        {/* Tag Filters */}
        {filters.tags.map(tag => (
          <button
            key={tag}
            onClick={() => onRemoveTag(tag)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 rounded-lg border border-purple-500/30 text-sm hover:border-purple-400 hover:bg-purple-500/30 transition-all group"
          >
            <Tag className="w-3 h-3" />
            <span>{tag}</span>
            <X className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}

        {/* In Stock Filter */}
        {filters.inStock && (
          <button
            onClick={onRemoveInStock}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 rounded-lg border border-green-500/30 text-sm hover:border-green-400 hover:bg-green-500/30 transition-all group"
          >
            <Check className="w-3 h-3" />
            <span>In Stock</span>
            <X className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        )}

        {/* Limited Edition Filter */}
        {filters.isLimitedEdition && (
          <button
            onClick={onRemoveLimitedEdition}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-violet-500/20 text-purple-300 rounded-lg border border-purple-500/30 text-sm hover:border-purple-400 hover:bg-purple-500/30 transition-all group"
          >
            <Sparkles className="w-3 h-3" />
            <span>Limited Edition</span>
            <X className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        )}

        {/* Pre-Order Filter */}
        {filters.isPreOrder && (
          <button
            onClick={onRemovePreOrder}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 rounded-lg border border-blue-500/30 text-sm hover:border-blue-400 hover:bg-blue-500/30 transition-all group"
          >
            <Clock className="w-3 h-3" />
            <span>Pre-Order</span>
            <X className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        )}

        {/* Price Range Filter */}
        {(filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice) && (
          <button
            onClick={() => {/* Handle price range reset */}}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-300 rounded-lg border border-pink-500/30 text-sm hover:border-pink-400 hover:bg-pink-500/30 transition-all group"
          >
            <span>₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}</span>
            <X className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        )}

        {/* Clear All Button */}
        <button
          onClick={onClearAll}
          className="px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg border border-gray-700 transition-colors hover:border-gray-600"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}
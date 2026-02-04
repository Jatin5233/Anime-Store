import { useState } from 'react';
import { Filter, Tag, ChevronDown, ChevronUp } from 'lucide-react';

interface FilterPanelProps {
  filters: {
    anime: string[];
    tags: string[];
    priceRange: [number, number];
    inStock: boolean;
    isLimitedEdition: boolean;
    isPreOrder: boolean;
  };
  filterOptions: {
    anime: string[];
    tags: string[];
    maxPrice: number;
  };
  onFilterChange: (key: string, value: any) => void;
  onToggleAnime: (anime: string) => void;
  onToggleTag: (tag: string) => void;
  onClearFilters: () => void;
}

export function FilterPanel({
  filters,
  filterOptions,
  onFilterChange,
  onToggleAnime,
  onToggleTag,
  onClearFilters,
}: FilterPanelProps) {
  const [expandedSections, setExpandedSections] = useState({
    anime: true,
    tags: true,
    advanced: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getActiveFilterCount = () => {
    return (
      filters.anime.length +
      filters.tags.length +
      (filters.inStock ? 1 : 0) +
      (filters.isLimitedEdition ? 1 : 0) +
      (filters.isPreOrder ? 1 : 0)
    );
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-cyan-500/20 p-6">
      {/* Panel Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
            <Filter className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Filters</h3>
            <p className="text-sm text-cyan-300/60">
              {getActiveFilterCount()} active filter{getActiveFilterCount() !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        {getActiveFilterCount() > 0 && (
          <button
            onClick={onClearFilters}
            className="text-sm text-cyan-300 hover:text-cyan-200 hover:bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/30 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Filter Sections */}
      <div className="space-y-6">
        {/* Anime Filter */}
        <div className="space-y-4">
          <button
            onClick={() => toggleSection('anime')}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              <h4 className="font-semibold text-white">Anime / Series</h4>
            </div>
            {expandedSections.anime ? (
              <ChevronUp className="w-4 h-4 text-cyan-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-cyan-400" />
            )}
          </button>

          {expandedSections.anime && (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {filterOptions.anime.map((anime) => (
                <label key={anime} className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={filters.anime.includes(anime)}
                      onChange={() => onToggleAnime(anime)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border group-hover:border-cyan-400 transition-colors ${
                      filters.anime.includes(anime)
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 border-transparent'
                        : 'border-cyan-500/30 bg-gray-800/50'
                    } flex items-center justify-center`}>
                      {filters.anime.includes(anime) && (
                        <div className="w-2 h-2 bg-white rounded"></div>
                      )}
                    </div>
                  </div>
                  <span className="text-gray-300 group-hover:text-cyan-300 transition-colors flex-1 truncate">
                    {anime}
                  </span>
                  <span className="text-xs text-gray-500">({/* count would go here */})</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Tags Filter */}
        <div className="space-y-4">
          <button
            onClick={() => toggleSection('tags')}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <h4 className="font-semibold text-white">Tags</h4>
            </div>
            {expandedSections.tags ? (
              <ChevronUp className="w-4 h-4 text-purple-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-purple-400" />
            )}
          </button>

          {expandedSections.tags && (
            <div className="flex flex-wrap gap-2">
              {filterOptions.tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => onToggleTag(tag)}
                  className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${
                    filters.tags.includes(tag)
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/40'
                      : 'bg-gray-800/30 text-gray-400 border-gray-700 hover:border-purple-500/30 hover:text-purple-300'
                  }`}
                >
                  <Tag className="w-3 h-3 inline mr-1.5" />
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Advanced Filters */}
        <div className="space-y-4">
          <button
            onClick={() => toggleSection('advanced')}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
              <h4 className="font-semibold text-white">Advanced Filters</h4>
            </div>
            {expandedSections.advanced ? (
              <ChevronUp className="w-4 h-4 text-pink-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-pink-400" />
            )}
          </button>

          {expandedSections.advanced && (
            <div className="space-y-6">
              {/* Price Range */}
              <div>
                <label className="text-sm font-semibold text-gray-300 block mb-3">Price Range (₹)</label>
                <div className="flex gap-2 w-full">
                  <input
                    type="number"
                    min="0"
                    placeholder="Min"
                    value={filters.priceRange[0] === 0 ? '' : filters.priceRange[0]}
                    onChange={(e) => onFilterChange('priceRange', [parseInt(e.target.value) || 0, filters.priceRange[1]])}
                    className="w-[45%] px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  />
                  <input
                    type="number"
                    min="0"
                    placeholder="Max"
                    value={filters.priceRange[1] === 10000 ? '' : filters.priceRange[1]}
                    onChange={(e) => onFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value) || 10000])}
                    className="w-[45%] px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Checkbox Filters */}
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={filters.inStock}
                      onChange={(e) => onFilterChange('inStock', e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border group-hover:border-green-400 transition-colors ${
                      filters.inStock
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 border-transparent'
                        : 'border-green-500/30 bg-gray-800/50'
                    } flex items-center justify-center`}>
                      {filters.inStock && <div className="w-2 h-2 bg-white rounded"></div>}
                    </div>
                  </div>
                  <span className="text-gray-300 group-hover:text-green-300 transition-colors">
                    In Stock Only
                  </span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={filters.isLimitedEdition}
                      onChange={(e) => onFilterChange('isLimitedEdition', e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border group-hover:border-purple-400 transition-colors ${
                      filters.isLimitedEdition
                        ? 'bg-gradient-to-r from-purple-500 to-violet-600 border-transparent'
                        : 'border-purple-500/30 bg-gray-800/50'
                    } flex items-center justify-center`}>
                      {filters.isLimitedEdition && <div className="w-2 h-2 bg-white rounded"></div>}
                    </div>
                  </div>
                  <span className="text-gray-300 group-hover:text-purple-300 transition-colors">
                    Limited Edition Only
                  </span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={filters.isPreOrder}
                      onChange={(e) => onFilterChange('isPreOrder', e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border group-hover:border-blue-400 transition-colors ${
                      filters.isPreOrder
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-600 border-transparent'
                        : 'border-blue-500/30 bg-gray-800/50'
                    } flex items-center justify-center`}>
                      {filters.isPreOrder && <div className="w-2 h-2 bg-white rounded"></div>}
                    </div>
                  </div>
                  <span className="text-gray-300 group-hover:text-blue-300 transition-colors">
                    Pre-Order Only
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import { Package, Filter, Search, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  title?: string;
  message?: string;
  showResetButton?: boolean;
  onReset?: () => void;
  showBrowseCategories?: boolean;
}

export function EmptyState({
  title = "No Products Found",
  message = "Try adjusting your filters or search terms to find what you're looking for.",
  showResetButton = true,
  onReset,
  showBrowseCategories = true,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12 md:py-20">
      {/* Animated Background */}
      <div className="relative mx-auto w-48 h-48 mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-full animate-pulse"></div>
        <div className="absolute inset-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center">
          <div className="relative">
            <Package className="w-16 h-16 text-gray-600" />
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center animate-bounce">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Message */}
      <h3 className="text-2xl md:text-3xl font-bold text-gray-300 mb-4">{title}</h3>
      <p className="text-gray-400 mb-8 max-w-md mx-auto text-lg">
        {message}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {showResetButton && (
          <button
            onClick={onReset}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity"
          >
            <Filter className="w-4 h-4" />
            <span>Reset All Filters</span>
          </button>
        )}
        
        <button className="flex items-center space-x-2 px-6 py-3 bg-gray-800/50 border border-gray-700 rounded-lg font-semibold text-gray-300 hover:text-white hover:border-gray-600 transition-colors">
          <Search className="w-4 h-4" />
          <span>Modify Search</span>
        </button>
      </div>

      {/* Browse Categories */}
      {showBrowseCategories && (
        <div className="mt-12">
          <h4 className="text-lg font-semibold text-cyan-300 mb-6">Browse Popular Categories</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {['Cyberpunk', 'Mecha', 'Limited Edition', 'New Arrivals'].map((category) => (
              <Link
                key={category}
                href={`/collections/${category.toLowerCase().replace(' ', '-')}`}
                className="group bg-gray-900/30 backdrop-blur-sm rounded-xl p-4 border border-cyan-500/10 hover:border-cyan-500/30 transition-all duration-300"
              >
                <div className="text-center">
                  <div className="w-10 h-10 mx-auto mb-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <div className="w-6 h-6 text-cyan-400">✨</div>
                  </div>
                  <h5 className="font-medium text-white group-hover:text-cyan-300 transition-colors">
                    {category}
                  </h5>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="mt-12 pt-8 border-t border-gray-800 max-w-2xl mx-auto">
        <h5 className="text-sm font-semibold text-cyan-300 mb-4">Quick Tips:</h5>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2 text-gray-400">
            <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
            <span>Try broader search terms</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>Clear some filters</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
            <span>Check back for new arrivals</span>
          </div>
        </div>
      </div>
    </div>
  );
}
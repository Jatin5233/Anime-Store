import type { Product } from '@/types/product';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  viewMode: 'grid' | 'list';
  onProductClick: (slug: string) => void;
  emptyState?: React.ReactNode;
}

export function ProductGrid({ 
  products, 
  loading, 
  viewMode, 
  onProductClick,
  emptyState 
}: ProductGridProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full animate-pulse"></div>
          </div>
        </div>
        <p className="mt-6 text-xl font-semibold text-cyan-300">Loading Collection</p>
        <p className="text-cyan-300/60">Fetching the latest figures...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return emptyState || (
      <div className="text-center py-20">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 text-gray-600">🎁</div>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-300 mb-3">No Products Found</h3>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Try adjusting your filters or search terms to find what you're looking for.
        </p>
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onClick={() => onProductClick(product.slug)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <div
          key={product._id}
          onClick={() => onProductClick(product.slug)}
          className="group bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-cyan-500/10 overflow-hidden cursor-pointer hover:border-cyan-500/30 transition-all duration-300"
        >
          <div className="flex flex-col md:flex-row">
            {/* Product Image */}
            <div className="md:w-48 lg:w-56 relative aspect-square md:aspect-auto md:h-auto bg-gradient-to-br from-gray-800 to-gray-900">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-full"></div>
              </div>
            </div>

            {/* Product Details */}
            <div className="flex-1 p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center space-x-3 mt-2">
                        <span className="text-cyan-400">{product.anime}</span>
                        {product.character && (
                          <>
                            <span className="text-gray-600">•</span>
                            <span className="text-purple-300">{product.character}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">
                        ${product.discountPrice || product.price}
                      </div>
                      {product.discountPrice && (
                        <div className="text-sm text-gray-400 line-through">
                          ${product.price}
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="mt-4 text-gray-300 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center space-x-4 mt-4">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-sm text-green-400">
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <span className="text-sm text-yellow-400">
                        {product.ratings.average} ({product.ratings.count} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
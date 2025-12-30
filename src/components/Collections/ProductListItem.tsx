import type { Product } from '@/types/product';
import { Star, Sparkles, Zap, Clock, Eye } from 'lucide-react';


interface ProductListItemProps {
  product: Product;
  onClick: () => void;
}

export function ProductListItem({ product, onClick }: ProductListItemProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getStatusBadge = () => {
    if (product.isLimitedEdition) {
      return {
        label: 'Limited Edition',
        color: 'from-purple-500 to-pink-600',
        icon: <Sparkles className="w-3 h-3" />
      };
    }
    if (product.isPreOrder) {
      return {
        label: 'Pre-Order',
        color: 'from-blue-500 to-cyan-600',
        icon: <Clock className="w-3 h-3" />
      };
    }
    if (product.stock < 10 && product.stock > 0) {
      return {
        label: 'Low Stock',
        color: 'from-orange-500 to-red-600',
        icon: <Zap className="w-3 h-3" />
      };
    }
    return null;
  };

  const statusBadge = getStatusBadge();

  return (
    <div
      onClick={onClick}
      className="group bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-cyan-500/10 overflow-hidden cursor-pointer hover:border-cyan-500/30 transition-all duration-300"
    >
      <div className="flex flex-col md:flex-row">
        {/* Product Image */}
        <div className="md:w-48 lg:w-56 relative aspect-square md:aspect-auto md:h-auto bg-gradient-to-br from-gray-800 to-gray-900">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-full"></div>
          </div>
          
          {/* Status Badge */}
          {statusBadge && (
            <div className="absolute top-3 left-3">
              <div className={`px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${statusBadge.color} text-white flex items-center space-x-1`}>
                {statusBadge.icon}
                <span>{statusBadge.label}</span>
              </div>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            {/* Left Column */}
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
                    {formatPrice(product.discountPrice || product.price)}
                  </div>
                  {product.discountPrice && (
                    <div className="text-sm text-gray-400 line-through">
                      {formatPrice(product.price)}
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="mt-4 text-gray-300 line-clamp-2">
                {product.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-300 rounded text-xs border border-purple-500/20"
                  >
                    
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Right Column - Stats */}
            <div className="lg:w-48 flex flex-col space-y-4">
              {/* Rating */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 font-bold text-white">
                    {product.ratings.average.toFixed(1)}
                  </span>
                </div>
                <span className="text-gray-400">
                  ({product.ratings.count} reviews)
                </span>
              </div>
              
              {/* Stock Status */}
              <div className={`flex items-center space-x-2 ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className="text-sm font-semibold">
                  {product.stock > 0 ? `${product.stock} units available` : 'Out of stock'}
                </span>
              </div>

              {/* View Button */}
              <button className="mt-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity opacity-0 lg:opacity-100 group-hover:opacity-100">
                View Product
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
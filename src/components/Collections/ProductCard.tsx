import type { Product } from '@/types/product';
import { Star, Sparkles, Zap, Clock, Eye } from 'lucide-react';
import Image from "next/image";


interface ProductCardProps {
  product: Product;
  onClick: (slug: string) => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const getProductBadges = () => {
    const badges = [];
    
    if (product.isLimitedEdition) {
      badges.push({
        label: 'Limited',
        color: 'from-purple-500 to-pink-600',
        icon: <Sparkles className="w-3 h-3" />
      });
    }
    
    if (product.isPreOrder) {
      badges.push({
        label: 'Pre-Order',
        color: 'from-blue-500 to-cyan-600',
        icon: <Clock className="w-3 h-3" />
      });
    }
    
    if (product.stock < 10 && product.stock > 0) {
      badges.push({
        label: 'Low Stock',
        color: 'from-orange-500 to-red-600',
        icon: <Zap className="w-3 h-3" />
      });
    }
    
    if (product.ratings.average >= 4.5) {
      badges.push({
        label: 'Top Rated',
        color: 'from-yellow-500 to-amber-600',
        icon: <Star className="w-3 h-3" />
      });
    }
    
    return badges;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const badges = getProductBadges();

  return (
    <div
      onClick={() => onClick(product.slug)}
      className="group relative bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-cyan-500/10 overflow-hidden cursor-pointer hover:border-cyan-500/30 hover:transform hover:-translate-y-1 transition-all duration-300"
    >
     <div className="relative aspect-square bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
  {product.images?.length > 0 ? (
    <Image
      src={product.images[0]}
      alt={product.name}
      fill
      className="object-cover transition-transform duration-500 group-hover:scale-105"
      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
      priority={false}
    />
  ) : (
    <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
      No Image
    </div>
  )}

  {/* Badges */}
  <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
    {badges.map((badge, index) => (
      <div
        key={index}
        className={`px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${badge.color} text-white flex items-center space-x-1`}
      >
        {badge.icon}
        <span>{badge.label}</span>
      </div>
    ))}
  </div>
</div>


      {/* Product Info */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="font-bold text-white group-hover:text-cyan-300 transition-colors duration-300 line-clamp-1">
            {product.name}
          </h3>
          {product.character && (
            <p className="text-sm text-cyan-400 mt-1">{product.character}</p>
          )}
          <p className="text-sm text-gray-400 mt-1">{product.anime}</p>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-xl font-bold text-white">
              {formatPrice(product.discountPrice || product.price)}
            </span>
            {product.discountPrice && (
              <span className="text-sm text-gray-400 line-through ml-2">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold text-white">
              {product.ratings.average.toFixed(1)}
            </span>
            <span className="text-xs text-gray-400">
              ({product.ratings.count})
            </span>
          </div>
        </div>

        {/* Stock & Tags */}
        <div className="flex items-center justify-between">
          <div className={`text-sm font-semibold ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </div>
          <div className="flex -space-x-1">
            {product.tags.slice(0, 3).map((tag, index) => (
              <div
                key={index}
                className="w-6 h-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30 flex items-center justify-center group/tag"
                title={tag}
              >
                <span className="text-xs text-purple-300 group-hover/tag:text-purple-200 transition-colors">T</span>
              </div>
            ))}
            {product.tags.length > 3 && (
              <div className="w-6 h-6 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full border border-gray-600 flex items-center justify-center group/tag">
                <span className="text-xs text-gray-300 group-hover/tag:text-gray-200 transition-colors">
                  +{product.tags.length - 3}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
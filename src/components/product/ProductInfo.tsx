'use client';

import { useState } from 'react';
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  Share2,
  AlertCircle,
  Check,
  Truck,
  Shield,
  Zap
} from 'lucide-react';
import ProductBadges from './ProductBadges';
import PriceBox from './PriceBox';
import QuantitySelector from './QuantitySelector';

interface ProductInfoProps {
  product: {
    _id: string;
    name: string;
    anime: string;
    character?: string;
    ratings: {
      average: number;
      count: number;
    };
    stock: number;
    price: number;
    discountPrice?: number;
    isLimitedEdition: boolean;
    isPreOrder: boolean;
    tags: string[];
    dimensions?: {
      height: number;
      width: number;
      depth: number;
    };
    material?: string;
    releaseDate?: string;
    features?: string[];
  };
  onAddToCart: () => void;
  onToggleWishlist: () => void;
  onShare: () => void;
}

export default function ProductInfo({ 
  product, 
  onAddToCart, 
  onToggleWishlist, 
  onShare 
}: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [isInCart, setIsInCart] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const badges = [];
  if (product.isLimitedEdition) badges.push('Limited Edition');
  if (product.isPreOrder) badges.push('Pre-Order');
  if (product.discountPrice) badges.push('On Sale');

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsInCart(true);
    onAddToCart();
    setIsAddingToCart(false);
  };

  const handleToggleWishlist = () => {
    setIsInWishlist(!isInWishlist);
    onToggleWishlist();
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 md:w-5 md:h-5 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-800 text-gray-800'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Product Header */}
      <div>
        {/* Badges */}
        <ProductBadges badges={badges} />

        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">
          {product.name}
        </h1>
        
        <div className="flex flex-wrap items-center gap-2 md:gap-4 text-sm md:text-base text-gray-300 mb-4">
          <span className="text-cyan-400 font-medium">{product.anime}</span>
          {product.character && (
            <>
              <span className="text-gray-600">•</span>
              <span className="text-purple-300">{product.character}</span>
            </>
          )}
        </div>

        {/* Rating */}
        <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-6">
          <div className="flex items-center gap-2">
            {renderStars(product.ratings.average)}
            <span className="text-base md:text-lg font-bold text-white">
              {product.ratings.average.toFixed(1)}
            </span>
          </div>
          <span className="text-sm md:text-base text-gray-400">
            ({product.ratings.count} reviews)
          </span>
          <span className="text-gray-600 hidden sm:inline">•</span>
          <span className={`text-xs md:text-sm font-semibold ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>
      </div>

      {/* Price Section */}
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl p-4 md:p-6 border border-cyan-500/20 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
          <PriceBox 
            price={product.discountPrice || product.price}
            originalPrice={product.discountPrice ? product.price : undefined}
            discount={product.discountPrice ? Math.round((1 - product.discountPrice/product.price) * 100) : undefined}
            inStock={product.stock > 0}
          />
          
          {/* Social Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleWishlist}
              className={`p-2.5 rounded-full border transition-all ${
                isInWishlist
                  ? 'bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-400 border-pink-500/30'
                  : 'bg-gray-800/30 text-gray-400 border-gray-700 hover:border-pink-500/30 hover:text-pink-400'
              }`}
              aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-pink-400' : ''}`} />
            </button>
            <button
              onClick={onShare}
              className="p-2.5 bg-gray-800/30 text-gray-400 border border-gray-700 rounded-full hover:border-cyan-500/30 hover:text-cyan-400 transition-all"
              aria-label="Share product"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quantity Selector */}
        <QuantitySelector 
          quantity={quantity}
          onQuantityChange={setQuantity}
          maxQuantity={product.stock}
        />

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart || isInCart || product.stock === 0}
            className={`w-full py-3 md:py-3.5 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2 text-sm md:text-base ${
              isInCart
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 cursor-default'
                : product.stock === 0
                ? 'bg-gradient-to-r from-red-500 to-red-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] hover:-translate-y-0.5'
            } ${isAddingToCart ? 'opacity-80 cursor-not-allowed' : ''}`}
          >
            {isAddingToCart ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Adding to Cart...</span>
              </>
            ) : isInCart ? (
              <>
                <Check className="w-5 h-5" />
                <span>Added to Cart</span>
              </>
            ) : product.stock === 0 ? (
              <>
                <AlertCircle className="w-5 h-5" />
                <span>Out of Stock</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>

          <button className="w-full py-3 md:py-3.5 border-2 border-cyan-400 text-cyan-300 rounded-lg font-bold hover:bg-cyan-500/10 transition-colors text-sm md:text-base">
            Buy Now
          </button>
        </div>

        {/* Stock Progress */}
        {product.stock > 0 && product.stock < 50 && (
          <div className="mt-6">
            <div className="flex justify-between text-xs md:text-sm mb-2">
              <span className="text-cyan-300">Only {product.stock} left in stock</span>
              <span className="text-gray-400">
                {Math.round((product.stock / 50) * 100)}% remaining
              </span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-300"
                style={{ width: `${(product.stock / 50) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Features & Details */}
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl p-4 md:p-6 border border-purple-500/20 shadow-xl">
        <h3 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-purple-400 flex-shrink-0" />
          <span>Features & Details</span>
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {product.dimensions && (
            <div className="space-y-1">
              <p className="text-xs md:text-sm text-gray-400">Dimensions</p>
              <p className="text-sm md:text-base font-semibold text-white">
                {product.dimensions.height}cm × {product.dimensions.width}cm × {product.dimensions.depth}cm
              </p>
            </div>
          )}
          
          {product.material && (
            <div className="space-y-1">
              <p className="text-xs md:text-sm text-gray-400">Material</p>
              <p className="text-sm md:text-base font-semibold text-white">{product.material}</p>
            </div>
          )}
          
          {product.releaseDate && (
            <div className="space-y-1">
              <p className="text-xs md:text-sm text-gray-400">Release Date</p>
              <p className="text-sm md:text-base font-semibold text-white">
                {new Date(product.releaseDate).toLocaleDateString()}
              </p>
            </div>
          )}
          
          <div className="space-y-1">
            <p className="text-xs md:text-sm text-gray-400">Availability</p>
            <p className="text-sm md:text-base font-semibold text-green-400">
              {product.isPreOrder ? 'Pre-Order Now' : 'In Stock'}
            </p>
          </div>
        </div>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-300 rounded-lg border border-purple-500/20 text-xs md:text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Shipping & Guarantee */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl p-4 border border-cyan-500/20 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm md:text-base font-semibold text-white">Free Shipping</p>
              <p className="text-xs md:text-sm text-gray-400">On orders over ₹100</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl p-4 border border-green-500/20 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm md:text-base font-semibold text-white">Authenticity Guarantee</p>
              <p className="text-xs md:text-sm text-gray-400">Official merchandise</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { getAccessToken } from '@/lib/authClient';
import { useRouter } from 'next/navigation';
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import Image from 'next/image';
import { Header } from "@/components/Home/Header";
import { useCartStore } from "@/store/cartStore";
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  Share2,
  AlertCircle,
  Check,
  Truck,
  Shield,
  Zap,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Clock,
  Minus,
  Plus,
  MessageSquare
} from 'lucide-react';
import { Product } from '@/types/product';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

// PriceBox Component
function PriceBox({ 
  price, 
  originalPrice, 
  inStock 
}: { 
  price: number; 
  originalPrice?: number; 
  inStock: boolean;
}) {
  return (
    <div className="flex flex-col">
      <div className="text-3xl md:text-4xl font-bold text-white">
        ₹{price.toFixed(2)}
      </div>
      {originalPrice && originalPrice > price && (
        <div className="flex items-center gap-2 mt-2">
          <span className="text-base md:text-lg text-gray-400 line-through">
            ₹{originalPrice.toFixed(2)}
          </span>
          <span className="px-2 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 rounded-md text-xs md:text-sm font-bold">
            Save ₹{(originalPrice - price).toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );
}

// ProductBadges Component
function ProductBadges({ badges }: { badges: string[] }) {
  const getBadgeIcon = (badge: string) => {
    switch(badge) {
      case 'Limited Edition':
        return <Sparkles className="w-3 h-3" />;
      case 'Pre-Order':
        return <Clock className="w-3 h-3" />;
      case 'On Sale':
        return <Zap className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getBadgeColor = (badge: string) => {
    switch(badge) {
      case 'Limited Edition':
        return 'bg-gradient-to-r from-purple-500 to-pink-600 text-white';
      case 'Pre-Order':
        return 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white';
      case 'On Sale':
        return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white';
      default:
        return 'bg-gradient-to-r from-gray-700 to-gray-800 text-white';
    }
  };

  if (!badges || badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {badges.map((badge, index) => (
        <span
          key={index}
          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${getBadgeColor(badge)}`}
        >
          {getBadgeIcon(badge)}
          <span>{badge}</span>
        </span>
      ))}
    </div>
  );
}

// QuantitySelector Component
function QuantitySelector({
  quantity,
  onQuantityChange,
  maxQuantity,
}: {
  quantity: number;
  onQuantityChange: (n: number) => void;
  maxQuantity: number;
}) {
  const isMinDisabled = quantity <= 1;
  const isMaxDisabled = quantity >= maxQuantity;

  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-sm md:text-base text-gray-400 font-medium">Quantity:</span>
      <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg p-1 border border-gray-700">
        <button
          onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
          disabled={isMinDisabled}
          className={`p-2 rounded-md transition-all ${
            isMinDisabled
              ? 'text-gray-600 cursor-not-allowed'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
          aria-label="Decrease quantity"
        >
          <Minus className="w-4 h-4" />
        </button>

        <span className="font-bold text-white min-w-[2rem] text-center text-sm md:text-base">
          {quantity}
        </span>

        <button
          onClick={() => onQuantityChange(Math.min(maxQuantity, quantity + 1))}
          disabled={isMaxDisabled}
          className={`p-2 rounded-md transition-all ${
            isMaxDisabled
              ? 'text-gray-600 cursor-not-allowed'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
          aria-label="Increase quantity"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      
      {maxQuantity < 10 && (
        <span className="text-xs text-gray-500">
          (Max: {maxQuantity})
        </span>
      )}
    </div>
  );
}

// ProductGallery Component
function ProductGallery({ images, productName }: { images: string[]; productName: string }) {
  const [selectedImage, setSelectedImage] = useState(0);
  
  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-gray-800 rounded-xl flex items-center justify-center text-gray-500">
        No Image Available
      </div>
    );
  }

  const handlePrevious = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-gray-900 rounded-xl overflow-hidden border border-cyan-500/20 shadow-2xl">
        <Image
          src={images[selectedImage]}
          alt={`${productName} - Image ${selectedImage + 1}`}
          fill
          className="object-cover"
          priority
        />

        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all backdrop-blur-sm"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all backdrop-blur-sm"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-sm">
            {selectedImage + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 md:grid-cols-5 gap-2 md:gap-3">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              onClick={() => setSelectedImage(index)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                index === selectedImage
                  ? 'border-cyan-500 shadow-lg shadow-cyan-500/50'
                  : 'border-gray-700 hover:border-gray-500'
              }`}
            >
              <Image
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                width={100}
                height={100}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ProductInfo Component
function ProductInfo({ 
  product, 
  onAddToCart, 
  onToggleWishlist, 
  onShare 
}: { 
  product: Product & { dimensions?: any; material?: string; features?: string[] }; 
  onAddToCart: () => void;
  onToggleWishlist: () => void;
  onShare: () => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const [isInCart, setIsInCart] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);

  const badges = [];
  if (product.isLimitedEdition) badges.push('Limited Edition');
  if (product.isPreOrder) badges.push('Pre-Order');
  if (product.discountPrice) badges.push('On Sale');

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    // update zustand store for immediate UI responsiveness
    try {
      addToCart(product as any, quantity);
    } catch (err) {
      console.error('store addToCart failed', err);
    }

    await new Promise((resolve) => setTimeout(resolve, 700));
    setIsInCart(true);
    // call parent handler which persists to localStorage and emits cartUpdated
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

// ProductDescription Component
function ProductDescription({ 
  description, 
  title = "Product Description" 
}: { 
  description: string; 
  title?: string;
}) {
  return (
    <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-2xl border border-cyan-500/20 overflow-hidden shadow-xl">
      <div className="p-4 md:p-6 border-b border-gray-800">
        <h2 className="text-xl md:text-2xl font-bold text-white flex items-center">
          <MessageSquare className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 text-cyan-400 flex-shrink-0" />
          <span>{title}</span>
        </h2>
      </div>
      
      <div className="p-4 md:p-6">
        <div className="text-sm md:text-base text-gray-300 whitespace-pre-line leading-relaxed">
          {description}
        </div>
      </div>
    </div>
  );
}

// ProductFeatures Component
function ProductFeatures({ features }: { features?: string[] }) {
  if (!features || features.length === 0) return null;

  return (
    <ul className="space-y-3">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start gap-3">
          <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <span className="text-sm md:text-base text-gray-300">{feature}</span>
        </li>
      ))}
    </ul>
  );
}

// Main ProductPage Component
export default function ProductPage({ params }: ProductPageProps) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { slug } = useParams<{ slug: string }>();


 useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${slug}`);
        setProduct(res.data.product);
      } catch (err) {
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;

    const token = getAccessToken();
    if (!token) {
      router.push('/login');
      return;
    }

    // Server/store already synced in ProductInfo; just notify UI
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    alert('Added to cart!');
  };

  const handleToggleWishlist = () => {
    if (!product) return;

    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const existingIndex = wishlist.findIndex((item: any) => item._id === product._id);
    
    if (existingIndex > -1) {
      wishlist.splice(existingIndex, 1);
      alert('Removed from wishlist!');
    } else {
      wishlist.push(product);
      alert('Added to wishlist!');
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    window.dispatchEvent(new CustomEvent('wishlistUpdated'));
  };

  const handleShare = async () => {
    if (!product) return;

    const shareData = {
      title: product.name,
      text: `Check out ${product.name} from ${product.anime}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <h1 className="text-3xl font-bold text-white mb-2">Product Not Found</h1>
          <p className="text-gray-400 mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <button
            onClick={() => router.push('/products')}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const extendedProduct = {
    ...product,
    dimensions: {
      height: 25,
      width: 15,
      depth: 12,
    },
    material: 'PVC & ABS',
    features: [
      'Officially licensed merchandise',
      'High-quality materials and craftsmanship',
      'Perfect for collectors and fans',
      'Comes in original packaging',
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      <Header />
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
      </div>

      {/* Main Product Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left: Gallery */}
          <div className="flex justify-center">
            <div className="w-full max-w-[720px]">
              <ProductGallery images={product.images} productName={product.name} />
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="w-full max-w-xl">
            <ProductInfo
              product={extendedProduct}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              onShare={handleShare}
            />
          </div>
        </div>

        {/* Bottom: Description and Features */}
        <div className="mt-12 lg:mt-16 space-y-8">
          {product.description && (
            <ProductDescription
              description={product.description}
              title="Product Description"
            />
          )}

          {extendedProduct.features && extendedProduct.features.length > 0 && (
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-2xl p-6 border border-purple-500/20 shadow-xl">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center">
                <Zap className="w-6 h-6 mr-3 text-purple-400" />
                Key Features
              </h2>
              <ProductFeatures features={extendedProduct.features} />
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="border-t border-gray-800 pt-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
            You May Also Like
          </h2>
          <div className="text-gray-500 text-center py-8">
            Related products coming soon...
          </div>
        </div>
      </div>
    </div>
  );
}
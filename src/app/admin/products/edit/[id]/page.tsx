'use client';

import { useState, useEffect } from 'react';
import { 
  Package, 
  Save, 
  X, 
  Upload, 
  DollarSign, 
  Hash, 
  Calendar,
  Tag,
  Image,
  Info,
  Check,
  AlertCircle,
  Loader2,
  Eye,
  Trash2,
  Sparkles,
  Star,
  Zap,
  Shield,
  Truck,
  Grid3x3,
  Users,
  Hash as HashIcon,
  CalendarDays,
  BarChart,
  TrendingUp
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

// Predefined options
const animeOptions = [
  'Neo Tokyo Chronicles',
  'Armored Core Legends',
  'Cyber Fantasy',
  'Shadow Realm',
  'Cyberpunk: Edgerunners',
  'Ghost in the Shell',
  'Akira',
  'Psycho-Pass',
  'Blame!',
  'Other Cyberpunk',
];

const tagOptions = [
  'Exclusive',
  'Rare',
  'Limited Edition',
  'Pre-Order',
  'New Arrival',
  'LED Feature',
  'Mecha',
  'Transformable',
  'Glow-in-dark',
  'Articulated',
  'Deluxe Version',
  'Holographic',
  'Digital Display',
  'Wireless Charging',
  'Voice Module',
];

const statusOptions = [
  { value: 'active', label: 'Active', color: 'from-green-500 to-emerald-600' },
  { value: 'inactive', label: 'Inactive', color: 'from-red-500 to-rose-600' },
  { value: 'draft', label: 'Draft', color: 'from-yellow-500 to-amber-600' },
  { value: 'archived', label: 'Archived', color: 'from-gray-500 to-gray-600' },
];

interface ProductFormData {
  name: string;
  slug: string;
  anime: string;
  character: string;
  description: string;
  price: number | '';
  discountPrice: number | '';
  stock: number | '';
  isLimitedEdition: boolean;
  isPreOrder: boolean;
  releaseDate: string;
  tags: string[];
  isActive: boolean;
  ratings: {
    average: number;
    count: number;
  };
  images: string[];
}

export default function EditProductForm() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [stats, setStats] = useState({
    views: 0,
    orders: 0,
    revenue: 0,
  });

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    slug: '',
    anime: '',
    character: '',
    description: '',
    price: '',
    discountPrice: '',
    stock: '',
    isLimitedEdition: false,
    isPreOrder: false,
    releaseDate: '',
    tags: [],
    isActive: true,
    ratings: {
      average: 0,
      count: 0,
    },
    images: [],
  });

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        
        // Replace with your actual API call
        const mockProduct = {
          _id: productId,
          name: 'Cyber Samurai Yori - Ultimate Edition',
          slug: 'cyber-samurai-yori-ultimate',
          anime: 'Neo Tokyo Chronicles',
          character: 'Yori',
          description: 'Premium cyberpunk figure with full articulation, LED lighting system, and holographic certification. Features:\n• 30 points of articulation\n• RGB LED lighting with mobile app control\n• Custom weapon accessories\n• Display stand with laser-etched serial number\n• Limited edition holographic card\n\nHeight: 30cm\nMaterial: PVC, ABS, LED components',
          price: 349.99,
          discountPrice: 299.99,
          stock: 42,
          isLimitedEdition: true,
          isPreOrder: false,
          releaseDate: '2024-03-15',
          tags: ['Exclusive', 'LED Feature', 'Limited Edition', 'Articulated'],
          isActive: true,
          ratings: {
            average: 4.8,
            count: 127,
          },
          images: [
            '/api/placeholder/400/500',
            '/api/placeholder/400/500',
            '/api/placeholder/400/500',
          ],
        };

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        setFormData({
          name: mockProduct.name,
          slug: mockProduct.slug,
          anime: mockProduct.anime,
          character: mockProduct.character,
          description: mockProduct.description,
          price: mockProduct.price,
          discountPrice: mockProduct.discountPrice,
          stock: mockProduct.stock,
          isLimitedEdition: mockProduct.isLimitedEdition,
          isPreOrder: mockProduct.isPreOrder,
          releaseDate: mockProduct.releaseDate,
          tags: mockProduct.tags,
          isActive: mockProduct.isActive,
          ratings: mockProduct.ratings,
          images: mockProduct.images,
        });

        setPreviewImages(mockProduct.images);
        setStats({
          views: 2450,
          orders: 89,
          revenue: 26699.11,
        });

        setErrors({});
      } catch (error) {
        console.error('Failed to fetch product:', error);
        setErrors({ fetch: 'Failed to load product data. Please try again.' });
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.anime) newErrors.anime = 'Anime selection is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (!formData.stock || formData.stock < 0) newErrors.stock = 'Valid stock quantity is required';
    if (formData.isPreOrder && !formData.releaseDate) newErrors.releaseDate = 'Release date is required for pre-orders';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [];
    for (let i = 0; i < Math.min(files.length, 5 - previewImages.length); i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push(reader.result as string);
        if (newImages.length === Math.min(files.length, 5 - previewImages.length)) {
          setPreviewImages(prev => [...prev, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setErrors({});
    
    try {
      // API call to update product
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          ...formData,
          images: previewImages,
          slug: formData.slug || generateSlug(formData.name),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Show success message and redirect
        router.push('/admin/products?updated=true&id=' + productId);
      } else {
        setErrors({ submit: data.message || 'Failed to update product' });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (response.ok) {
        router.push('/admin/products?deleted=true');
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  const handlePreview = () => {
    window.open(`/product/${formData.slug || generateSlug(formData.name)}`, '_blank');
  };

  const handleDuplicate = () => {
    const newProduct = {
      ...formData,
      name: `${formData.name} (Copy)`,
      slug: `${formData.slug}-copy`,
      stock: 0,
      ratings: { average: 0, count: 0 },
    };
    
    // Here you would call your API to create the duplicate
    console.log('Duplicating product:', newProduct);
    alert('Product duplicated! This would create a new product in production.');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black p-4 md:p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <p className="mt-4 text-cyan-300 font-semibold">Loading Product Data...</p>
            <p className="text-sm text-cyan-300/60">Fetching the latest details</p>
          </div>
        </div>
      </div>
    );
  }

  if (errors.fetch) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-red-900/20 to-red-950/20 rounded-2xl border border-red-500/30 p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-red-300 mb-3">Failed to Load Product</h3>
            <p className="text-gray-300 mb-6 max-w-md mx-auto">{errors.fetch}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity"
              >
                Try Again
              </button>
              <Link
                href="/admin/products"
                className="px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded-lg font-semibold text-gray-300 hover:text-white transition-colors"
              >
                Back to Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Package className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    Edit Product
                  </h1>
                  <p className="text-cyan-300/70">
                    Update product details and specifications
                  </p>
                </div>
              </div>
              
              {/* Product Stats */}
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/20">
                  <Eye className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-semibold text-cyan-300">{stats.views.toLocaleString()} views</span>
                </div>
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-semibold text-purple-300">{stats.orders} orders</span>
                </div>
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-semibold text-green-300">${stats.revenue.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handlePreview}
                className="flex items-center space-x-2 px-4 py-2.5 text-sm font-semibold text-cyan-300 hover:text-cyan-200 hover:bg-cyan-500/10 rounded-lg transition-colors border border-cyan-500/30"
              >
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>
              <button
                onClick={handleDuplicate}
                className="flex items-center space-x-2 px-4 py-2.5 text-sm font-semibold text-purple-300 hover:text-purple-200 hover:bg-purple-500/10 rounded-lg transition-colors border border-purple-500/30"
              >
                <Sparkles className="w-4 h-4" />
                <span>Duplicate</span>
              </button>
              <Link
                href="/admin/products"
                className="flex items-center space-x-2 px-4 py-2.5 text-sm font-semibold text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors border border-gray-700"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information Card */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-cyan-500/20 overflow-hidden">
              <div className="p-6 border-b border-gray-800">
                <div className="flex items-center space-x-3">
                  <Info className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-xl font-bold text-white">Basic Information</h2>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Product Name & Slug */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300 flex items-center">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({
                        ...formData,
                        name: e.target.value,
                        slug: generateSlug(e.target.value)
                      })}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 text-white placeholder-gray-500 transition-all"
                      placeholder="Enter product name"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-400 flex items-center mt-1">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300 flex items-center">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 text-white placeholder-gray-500 transition-all"
                      placeholder="auto-generated-slug"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      https://animestore.com/product/{formData.slug || 'your-slug'}
                    </p>
                  </div>
                </div>

                {/* Anime & Character */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300">Anime / Series *</label>
                    <select
                      value={formData.anime}
                      onChange={(e) => setFormData({ ...formData, anime: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 text-white appearance-none"
                    >
                      <option value="">Select Anime</option>
                      {animeOptions.map(anime => (
                        <option key={anime} value={anime}>{anime}</option>
                      ))}
                    </select>
                    {errors.anime && (
                      <p className="text-sm text-red-400 flex items-center mt-1">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.anime}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300">Character Name</label>
                    <input
                      type="text"
                      value={formData.character}
                      onChange={(e) => setFormData({ ...formData, character: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 text-white placeholder-gray-500"
                      placeholder="Character name"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 text-white placeholder-gray-500 resize-none"
                    placeholder="Detailed product description..."
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Include features, materials, dimensions</span>
                    <span>{formData.description.length}/2000 characters</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing & Stock Card */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-green-500/20 overflow-hidden">
              <div className="p-6 border-b border-gray-800">
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <h2 className="text-xl font-bold text-white">Pricing & Inventory</h2>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Price */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300">Price ($) *</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3.5 w-5 h-5 text-green-400" />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value ? Number(e.target.value) : '' })}
                        className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-green-500/30 rounded-lg focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400/50 text-white"
                        placeholder="0.00"
                      />
                    </div>
                    {errors.price && (
                      <p className="text-sm text-red-400 flex items-center mt-1">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.price}
                      </p>
                    )}
                  </div>

                  {/* Discount Price */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300">Discount Price ($)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3.5 w-5 h-5 text-purple-400" />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.discountPrice}
                        onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value ? Number(e.target.value) : '' })}
                        className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 text-white"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs mt-1">
                      {formData.discountPrice && formData.price && (
                        <span className="text-green-400">
                          Save {(((Number(formData.price) - Number(formData.discountPrice)) / Number(formData.price)) * 100).toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stock */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300">Stock Quantity *</label>
                    <div className="relative">
                      <HashIcon className="absolute left-3 top-3.5 w-5 h-5 text-blue-400" />
                      <input
                        type="number"
                        min="0"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value ? Number(e.target.value) : '' })}
                        className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-blue-500/30 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50 text-white"
                        placeholder="0"
                      />
                    </div>
                    {errors.stock && (
                      <p className="text-sm text-red-400 flex items-center mt-1">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.stock}
                      </p>
                    )}
                    <div className={`text-xs mt-1 ${Number(formData.stock) < 10 ? 'text-red-400' : 'text-green-400'}`}>
                      {Number(formData.stock) < 10 ? 'Low stock warning' : 'Stock level healthy'}
                    </div>
                  </div>
                </div>

                {/* Special Options */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={formData.isLimitedEdition}
                          onChange={(e) => setFormData({ ...formData, isLimitedEdition: e.target.checked })}
                          className="sr-only"
                        />
                        <div className={`w-6 h-6 rounded border group-hover:border-purple-400 transition-colors ${
                          formData.isLimitedEdition 
                            ? 'bg-gradient-to-r from-purple-500 to-purple-600 border-transparent' 
                            : 'border-purple-500/30 bg-gray-800/50'
                        } flex items-center justify-center transition-all`}>
                          {formData.isLimitedEdition && <Check className="w-4 h-4 text-white" />}
                        </div>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-300 group-hover:text-purple-300 transition-colors">
                          Limited Edition
                        </span>
                        <p className="text-sm text-gray-500">Exclusive, numbered production run</p>
                      </div>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={formData.isPreOrder}
                          onChange={(e) => setFormData({ ...formData, isPreOrder: e.target.checked })}
                          className="sr-only"
                        />
                        <div className={`w-6 h-6 rounded border group-hover:border-blue-400 transition-colors ${
                          formData.isPreOrder 
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 border-transparent' 
                            : 'border-blue-500/30 bg-gray-800/50'
                        } flex items-center justify-center transition-all`}>
                          {formData.isPreOrder && <Check className="w-4 h-4 text-white" />}
                        </div>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-300 group-hover:text-blue-300 transition-colors">
                          Pre-Order
                        </span>
                        <p className="text-sm text-gray-500">Accept orders before release</p>
                      </div>
                    </label>
                  </div>

                  {/* Release Date */}
                  <div className={`space-y-2 transition-all ${!formData.isPreOrder && 'opacity-50'}`}>
                    <label className="text-sm font-semibold text-gray-300">Release Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-blue-400" />
                      <input
                        type="date"
                        value={formData.releaseDate}
                        onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                        disabled={!formData.isPreOrder}
                        className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-blue-500/30 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50 text-white disabled:opacity-50"
                      />
                    </div>
                    {errors.releaseDate && (
                      <p className="text-sm text-red-400 flex items-center mt-1">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.releaseDate}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Images Card */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-pink-500/20 overflow-hidden">
              <div className="p-6 border-b border-gray-800">
                <div className="flex items-center space-x-3">
                  <Image className="w-5 h-5 text-pink-400" />
                  <h2 className="text-xl font-bold text-white">Product Images</h2>
                </div>
              </div>
              
              <div className="p-6">
                {/* Image Upload Area */}
                <div className="border-2 border-dashed border-cyan-500/30 rounded-xl p-8 text-center hover:border-cyan-400 transition-colors bg-gray-800/20">
                  <input
                    type="file"
                    id="image-upload"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer block">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-full flex items-center justify-center">
                      <Upload className="w-10 h-10 text-cyan-400" />
                    </div>
                    <p className="text-lg font-semibold text-cyan-300 mb-2">Click to upload images</p>
                    <p className="text-sm text-gray-400 mb-4">PNG, JPG, WEBP up to 5MB each</p>
                    <p className="text-xs text-gray-500">Upload up to {5 - previewImages.length} more images ({previewImages.length}/5 used)</p>
                  </label>
                </div>

                {/* Image Previews */}
                {previewImages.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Uploaded Images</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {previewImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                            <div className="w-full h-full bg-gradient-to-br from-cyan-500/10 to-purple-500/10 flex items-center justify-center">
                              <Image className="w-12 h-12 text-gray-600" />
                            </div>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                              <span className="text-xs font-semibold text-white">
                                Image {index + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            {index === 0 && (
                              <div className="absolute top-3 left-3">
                                <span className="px-2 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-xs font-bold text-white rounded">
                                  Main
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-cyan-500/20 overflow-hidden">
              <div className="p-6 border-b border-gray-800">
                <h3 className="text-lg font-bold text-white">Status & Actions</h3>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Status Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-300">Product Status</label>
                  <div className="space-y-2">
                    {statusOptions.map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          formData.isActive === (option.value === 'active')
                            ? `bg-gradient-to-r ${option.color}/20 text-white border-${option.value === 'active' ? 'cyan' : option.value === 'inactive' ? 'red' : option.value === 'draft' ? 'yellow' : 'gray'}-500/50`
                            : 'bg-gray-800/30 border-gray-700 text-gray-400 hover:border-gray-600'
                        }`}
                      >
                        <div className="relative">
                          <input
                            type="radio"
                            name="status"
                            checked={formData.isActive === (option.value === 'active')}
                            onChange={() => setFormData({ ...formData, isActive: option.value === 'active' })}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 rounded-full border ${
                            formData.isActive === (option.value === 'active')
                              ? 'border-transparent bg-white'
                              : 'border-gray-600 bg-transparent'
                          } flex items-center justify-center`}>
                            {formData.isActive === (option.value === 'active') && (
                              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600"></div>
                            )}
                          </div>
                        </div>
                        <span className="font-medium">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Ratings */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-300">Ratings</label>
                  <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700">
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-xl font-bold text-white">{formData.ratings.average.toFixed(1)}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-300">{formData.ratings.count} reviews</div>
                      <div className="text-xs text-gray-500">Overall rating</div>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="space-y-3 pt-6 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={saving}
                    className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg font-bold text-white hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleDelete}
                    className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Product</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Tags Card */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-purple-500/20 overflow-hidden">
              <div className="p-6 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Product Tags</h3>
                  <Tag className="w-5 h-5 text-purple-400" />
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex flex-wrap gap-2">
                  {tagOptions.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                        formData.tags.includes(tag)
                          ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/40'
                          : 'bg-gray-800/30 text-gray-400 border-gray-700 hover:border-purple-500/30 hover:text-purple-300'
                      }`}
                    >
                      {tag}
                      {formData.tags.includes(tag) && (
                        <Check className="w-3 h-3 inline ml-1.5" />
                      )}
                    </button>
                  ))}
                </div>
                
                {formData.tags.length > 0 && (
                  <div className="mt-4 p-3 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-lg border border-cyan-500/10">
                    <p className="text-sm text-cyan-300 font-semibold mb-1">Selected Tags ({formData.tags.length})</p>
                    <p className="text-xs text-gray-400">
                      {formData.tags.join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* SEO Preview Card */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-green-500/20 overflow-hidden">
              <div className="p-6 border-b border-gray-800">
                <h3 className="text-lg font-bold text-white">SEO Preview</h3>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300">Page Title</label>
                  <div className="p-3 bg-gray-800/30 rounded-lg border border-gray-700">
                    <p className="text-white font-medium line-clamp-1">
                      {formData.name || 'Product Name'} - AnimeStore Cyberpunk Collectibles
                    </p>
                    <p className="text-xs text-cyan-400 mt-1">
                      https://animestore.com/product/{formData.slug || 'product-slug'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300">Meta Description</label>
                  <div className="p-3 bg-gray-800/30 rounded-lg border border-gray-700">
                    <p className="text-gray-300 text-sm line-clamp-2">
                      {formData.description.substring(0, 150) || 'Premium cyberpunk anime figure collectible. Limited edition availability.'}...
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-800">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Last Updated</span>
                    <span className="text-cyan-300">Just now</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {errors.submit && (
          <div className="mt-6 p-4 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 rounded-xl">
            <p className="text-red-300 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {errors.submit}
            </p>
          </div>
        )}

        {/* Form Actions Footer */}
        <div className="mt-8 p-6 bg-gray-900/30 rounded-2xl border border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-400">
                Make sure all required fields are filled before saving.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Changes are saved to draft until published.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/products"
                className="px-6 py-3 text-sm font-semibold text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors border border-gray-700"
              >
                Discard Changes
              </Link>
              
              <button
                type="button"
                onClick={() => {
                  // Save as draft
                  handleSubmit(new Event('submit') as any);
                }}
                className="px-6 py-3 text-sm font-semibold text-cyan-300 hover:text-cyan-200 hover:bg-cyan-500/10 rounded-lg transition-colors border border-cyan-500/30"
              >
                Save as Draft
              </button>
              
              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>Publish Changes</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
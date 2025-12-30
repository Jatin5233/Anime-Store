'use client';

import { useState } from 'react';
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
  AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from "@/lib/axios";
const animeList = [
  'Naruto',
  'One Piece',
  'Attack on Titan',
  'Demon Slayer',
  'Jujutsu Kaisen',
  'My Hero Academia',
  'Neo Tokyo Chronicles',
  'Armored Core Legends',
  'Cyber Fantasy',
  'Shadow Realm',
  'Other',
];

const tagOptions = [
  'Exclusive',
  'Rare',
  'Limited Edition',
  'Pre-Order',
  'New',
  'LED',
  'Mecha',
  'Transformable',
  'Glow-in-dark',
  'Sold Out',
];

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewImages, setPreviewImages] = useState<string[]>([]);
const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    anime: '',
    character: '',
    description: '',
    price: '',
    discountPrice: '',
    stock: '',
    isLimitedEdition: false,
    isPreOrder: false,
    releaseDate: '',
    tags: [] as string[],
    isActive: true,
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.anime) newErrors.anime = 'Anime selection is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = 'Valid stock quantity is required';
    if (formData.isPreOrder && !formData.releaseDate) newErrors.releaseDate = 'Release date is required for pre-orders';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 

const handleImageUpload = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const files = e.target.files;
  if (!files) return;

  for (let i = 0; i < Math.min(files.length, 5); i++) {
    const file = files[i];

    // UI preview only
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImages(prev => [...prev, reader.result as string]);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary (ADMIN AUTH REQUIRED)
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post("/admin/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    setUploadedImages(prev => [...prev, res.data.url]);
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

  if (!validateForm()) return;
  if (uploadedImages.length === 0) {
    setErrors({ submit: "Please upload at least one image" });
    return;
  }

  setLoading(true);

  try {
    
const res = await api.post("/admin/products", {
  name: formData.name,
  anime: formData.anime,
  character: formData.character,
  description: formData.description,
  price: Number(formData.price),
  discountPrice: formData.discountPrice
    ? Number(formData.discountPrice)
    : undefined,
  stock: Number(formData.stock),
  isLimitedEdition: formData.isLimitedEdition,
  isPreOrder: formData.isPreOrder,
  releaseDate: formData.releaseDate
    ? new Date(formData.releaseDate)
    : undefined,
  tags: formData.tags,
  images: uploadedImages, // ✅ Cloudinary URLs
  isActive: formData.isActive,
});

    

    router.push("/admin/products?created=true");
  } catch (err: any) {
    setErrors({ submit: err.message });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Package className="w-6 h-6 mr-3 text-cyan-400" />
            Add New Product
          </h2>
          <p className="text-cyan-300/70 mt-1">Create a new anime figure listing</p>
        </div>
        
        <Link
          href="/admin/products"
          className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors border border-gray-700"
        >
          Cancel
        </Link>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center space-x-2 mb-6">
            <Info className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">Basic Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300">Product Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-400 text-white"
                placeholder="e.g., Cyber Samurai Yori"
              />
              {errors.name && (
                <p className="text-sm text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Anime */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300">Anime *</label>
              <select
                value={formData.anime}
                onChange={(e) => setFormData({ ...formData, anime: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-400 text-white"
              >
                <option value="">Select Anime</option>
                {animeList.map(anime => (
                  <option key={anime} value={anime}>{anime}</option>
                ))}
              </select>
              {errors.anime && (
                <p className="text-sm text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.anime}
                </p>
              )}
            </div>

            {/* Character */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300">Character Name</label>
              <input
                type="text"
                value={formData.character}
                onChange={(e) => setFormData({ ...formData, character: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900/50 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-400 text-white"
                placeholder="e.g., Yori"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-gray-300">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 bg-gray-900/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-400 text-white resize-none"
                placeholder="Describe the product features, materials, dimensions..."
              />
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center space-x-2 mb-6">
            <DollarSign className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Pricing & Stock</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Price */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300">Price (Rs) *</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3.5 w-4 h-4 text-cyan-400" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-400 text-white"
                  placeholder="0.00"
                />
              </div>
              {errors.price && (
                <p className="text-sm text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.price}
                </p>
              )}
            </div>

            {/* Discount Price */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300">Discount Price (Rs)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3.5 w-4 h-4 text-purple-400" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.discountPrice}
                  onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-400 text-white"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Stock */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300">Stock Quantity *</label>
              <div className="relative">
                <Hash className="absolute left-3 top-3.5 w-4 h-4 text-green-400" />
                <input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-green-500/30 rounded-lg focus:outline-none focus:border-green-400 text-white"
                  placeholder="0"
                />
              </div>
              {errors.stock && (
                <p className="text-sm text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.stock}
                </p>
              )}
            </div>

            {/* Special Options */}
            <div className="md:col-span-3">
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.isLimitedEdition}
                      onChange={(e) => setFormData({ ...formData, isLimitedEdition: e.target.checked })}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border ${formData.isLimitedEdition ? 'bg-gradient-to-r from-purple-500 to-purple-600 border-transparent' : 'border-purple-500/30 bg-gray-900/50'} flex items-center justify-center transition-all`}>
                      {formData.isLimitedEdition && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                  <span className="text-sm text-gray-300">Limited Edition</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.isPreOrder}
                      onChange={(e) => setFormData({ ...formData, isPreOrder: e.target.checked })}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border ${formData.isPreOrder ? 'bg-gradient-to-r from-blue-500 to-blue-600 border-transparent' : 'border-blue-500/30 bg-gray-900/50'} flex items-center justify-center transition-all`}>
                      {formData.isPreOrder && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                  <span className="text-sm text-gray-300">Pre-Order</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border ${formData.isActive ? 'bg-gradient-to-r from-green-500 to-green-600 border-transparent' : 'border-green-500/30 bg-gray-900/50'} flex items-center justify-center transition-all`}>
                      {formData.isActive && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                  <span className="text-sm text-gray-300">Active Product</span>
                </label>
              </div>
            </div>

            {/* Release Date (for pre-orders) */}
            {formData.isPreOrder && (
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold text-gray-300">Release Date *</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-blue-400" />
                  <input
                    type="date"
                    value={formData.releaseDate}
                    onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-blue-500/30 rounded-lg focus:outline-none focus:border-blue-400 text-white"
                  />
                </div>
                {errors.releaseDate && (
                  <p className="text-sm text-red-400 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.releaseDate}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Images */}
        <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center space-x-2 mb-6">
            <Image className="w-5 h-5 text-pink-400" />
            <h3 className="text-lg font-semibold text-white">Product Images</h3>
          </div>

          <div className="space-y-4">
            {/* Image Upload Area */}
            <div className="border-2 border-dashed border-cyan-500/30 rounded-xl p-8 text-center hover:border-cyan-400 transition-colors">
              <input
                type="file"
                id="image-upload"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-cyan-400" />
                </div>
                <p className="text-cyan-300 font-semibold mb-1">Click to upload images</p>
                <p className="text-sm text-gray-400">PNG, JPG, WEBP up to 5MB (Max 5 images)</p>
              </label>
            </div>

            {/* Image Previews */}
            {previewImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {previewImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-900">
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 text-center text-xs text-white">
                      Image {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center space-x-2 mb-6">
            <Tag className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Product Tags</h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {tagOptions.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-4 py-2 rounded-lg border transition-all ${formData.tags.includes(tag)
                  ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border-cyan-500/30'
                  : 'bg-gray-900/50 text-gray-400 border-gray-700 hover:border-cyan-500/30 hover:text-cyan-300'
                }`}
              >
                {tag}
                {formData.tags.includes(tag) && (
                  <Check className="w-3 h-3 inline ml-2" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-700">
          <Link
            href="/admin/products"
            className="px-6 py-3 text-sm font-semibold text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors border border-gray-700"
          >
            Cancel
          </Link>
          
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => {
                // Reset form
                setFormData({
                  name: '',
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
                });
                setPreviewImages([]);
                setErrors({});
              }}
              className="px-6 py-3 text-sm font-semibold text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors border border-gray-700"
            >
              Reset Form
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Product</span>
                </>
              )}
            </button>
          </div>
        </div>

        {errors.submit && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-300 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              {errors.submit}
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
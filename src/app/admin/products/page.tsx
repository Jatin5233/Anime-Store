'use client';

import { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Tag,
  Zap,
  Star,
  TrendingUp,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  CheckCircle,
  XCircle
} from 'lucide-react';
import Link from 'next/link';
import api from "@/lib/axios";

interface Product {
  _id: string;
  name: string;
  slug: string;
  anime: string;
  character?: string;
  price: number;
  discountPrice?: number;
  stock: number;
  isLimitedEdition: boolean;
  isPreOrder: boolean;
  isActive: boolean;
  ratings: {
    average: number;
    count: number;
  };
  tags: string[];
  createdAt: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    anime: '',
    status: '',
    tag: '',
  });
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await api.get("/admin/products");
      setProducts(res.data.products);
    } catch (err) {
      console.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, []);


  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.anime.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAnime = !filters.anime || product.anime === filters.anime;
    const matchesStatus = !filters.status || 
      (filters.status === 'active' ? product.isActive : !product.isActive);
    const matchesTag = !filters.tag || product.tags.includes(filters.tag);
    
    return matchesSearch && matchesAnime && matchesStatus && matchesTag;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const animeOptions = Array.from(new Set(products.map(p => p.anime)));
  const tagOptions = Array.from(new Set(products.flatMap(p => p.tags)));

  const handleDelete = async (id: string) => {
  if (!confirm("Are you sure you want to delete this product?")) return;

  try {
    await api.delete(`/admin/products/${id}`);
    setProducts(prev => prev.filter(p => p._id !== id));
  } catch {
    alert("Failed to delete product");
  }
};


  const toggleProductSelection = (id: string) => {
    setSelectedProducts(prev =>
      prev.includes(id)
        ? prev.filter(productId => productId !== id)
        : [...prev, id]
    );
  };

 const handleBulkAction = async (
  action: "activate" | "deactivate" | "delete"
) => {
  if (selectedProducts.length === 0) {
    alert("Please select products first");
    return;
  }

  try {
    if (action === "delete") {
      if (!confirm(`Delete ${selectedProducts.length} product(s)?`)) return;

      await Promise.all(
        selectedProducts.map(id =>
          api.delete(`/admin/products/${id}`)
        )
      );

      setProducts(prev =>
        prev.filter(p => !selectedProducts.includes(p._id))
      );
    } else {
      await Promise.all(
        selectedProducts.map(id =>
          api.put(`/admin/products/${id}`, {
            isActive: action === "activate",
          })
        )
      );

      setProducts(prev =>
        prev.map(p =>
          selectedProducts.includes(p._id)
            ? { ...p, isActive: action === "activate" }
            : p
        )
      );
    }

    setSelectedProducts([]);
  } catch {
    alert("Bulk action failed");
  }
};


  const getStatusBadge = (product: Product) => {
    if (!product.isActive) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-300 border border-red-500/30">
          <XCircle className="w-3 h-3 mr-1" />
          Inactive
        </span>
      );
    }
    
    if (product.stock === 0) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-300 border border-orange-500/30">
          <AlertCircle className="w-3 h-3 mr-1" />
          Out of Stock
        </span>
      );
    }
    
    if (product.isPreOrder) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-300 border border-blue-500/30">
          <Zap className="w-3 h-3 mr-1" />
          Pre-Order
        </span>
      );
    }
    
    if (product.isLimitedEdition) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-300 border border-purple-500/30">
          <Star className="w-3 h-3 mr-1" />
          Limited
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-300 border border-green-500/30">
        <CheckCircle className="w-3 h-3 mr-1" />
        Active
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Package className="w-6 h-6 mr-3 text-cyan-400" />
            Product Management
          </h2>
          <p className="text-cyan-300/70 mt-1">Manage your anime figure collection</p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <Link
            href="/admin/products/new"
            className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 bg-gray-800/30 rounded-xl p-4 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-cyan-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-900/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-400 text-white text-sm"
            />
          </div>

          {/* Anime Filter */}
          <select
            value={filters.anime}
            onChange={(e) => setFilters({ ...filters, anime: e.target.value })}
            className="px-4 py-2.5 bg-gray-900/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-400 text-white text-sm"
          >
            <option value="">All Anime</option>
            {animeOptions.map(anime => (
              <option key={anime} value={anime}>{anime}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2.5 bg-gray-900/50 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-400 text-white text-sm"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Tag Filter */}
          <select
            value={filters.tag}
            onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
            className="px-4 py-2.5 bg-gray-900/50 border border-pink-500/30 rounded-lg focus:outline-none focus:border-pink-400 text-white text-sm"
          >
            <option value="">All Tags</option>
            {tagOptions.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <div className="mt-4 p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm text-cyan-300">
                  {selectedProducts.length} product(s) selected
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBulkAction('activate')}
                  className="px-3 py-1.5 text-sm bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-300 border border-green-500/30 rounded-lg hover:border-green-400 transition-colors"
                >
                  Activate
                </button>
                <button
                  onClick={() => handleBulkAction('deactivate')}
                  className="px-3 py-1.5 text-sm bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-300 border border-orange-500/30 rounded-lg hover:border-orange-400 transition-colors"
                >
                  Deactivate
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="px-3 py-1.5 text-sm bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-300 border border-red-500/30 rounded-lg hover:border-red-400 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-700">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-800/50 border-b border-gray-700">
              <th className="py-3 px-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedProducts.length === products.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedProducts(products.map(p => p._id));
                    } else {
                      setSelectedProducts([]);
                    }
                  }}
                  className="rounded border-gray-600 bg-gray-700 text-cyan-500 focus:ring-cyan-500"
                />
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-cyan-300">Product</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-cyan-300">Anime</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-cyan-300">Price</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-cyan-300">Stock</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-cyan-300">Status</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-cyan-300">Rating</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-cyan-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product) => (
              <tr key={product._id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                <td className="py-3 px-4">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product._id)}
                    onChange={() => toggleProductSelection(product._id)}
                    className="rounded border-gray-600 bg-gray-700 text-cyan-500 focus:ring-cyan-500"
                  />
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <div className="font-medium text-white">{product.name}</div>
                      {product.character && (
                        <div className="text-xs text-gray-400">{product.character}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-300">{product.anime}</span>
                </td>
                <td className="py-3 px-4">
                  <div className="space-y-1">
                    <div className="font-semibold text-white">
                      ₹{product.discountPrice?.toFixed(2) || product.price.toFixed(2)}
                    </div>
                    {product.discountPrice && (
                      <div className="text-xs text-gray-400 line-through">
                        ₹{product.price.toFixed(2)}
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className={`text-sm font-semibold ${product.stock > 10 ? 'text-green-400' : product.stock > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {product.stock} units
                  </div>
                </td>
                <td className="py-3 px-4">
                  {getStatusBadge(product)}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 font-semibold text-white">
                        {product.ratings.average}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      ({product.ratings.count})
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/product/${product.slug}`}
                      target="_blank"
                      className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-gray-700/50 rounded-lg transition-colors"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/admin/products/edit/${product._id}`}
                      className="p-2 text-gray-400 hover:text-green-400 hover:bg-gray-700/50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700/50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-purple-400 hover:bg-gray-700/50 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {paginatedProducts.length === 0 && (
          <div className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center">
              <Package className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-400 mb-2">No products found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
            <Link
              href="/admin/products/new"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Product</span>
            </Link>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-400">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-gray-800/50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = currentPage <= 3 
                ? i + 1 
                : currentPage >= totalPages - 2 
                  ? totalPages - 4 + i 
                  : currentPage - 2 + i;
              
              if (pageNum < 1 || pageNum > totalPages) return null;
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    currentPage === pageNum
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white'
                      : 'text-gray-400 hover:text-cyan-400 hover:bg-gray-800/50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-gray-800/50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
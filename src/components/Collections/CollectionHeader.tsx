import { Package, TrendingUp, Sparkles, Clock } from 'lucide-react';

interface CollectionHeaderProps {
  title: string;
  description: string;
  stats: {
    total: number;
    limited: number;
    preOrder: number;
    newItems: number;
  };
}

export function CollectionHeader({ title, description, stats }: CollectionHeaderProps) {
  return (
    <>
      {/* Page Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-lg text-cyan-300/70 max-w-3xl mx-auto">
          {description}
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {/* Total Items */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-cyan-500/10 group hover:border-cyan-500/30 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 group-hover:text-cyan-300 transition-colors">Total Items</p>
              <p className="text-2xl font-bold text-cyan-300 group-hover:text-cyan-200 transition-colors">
                {stats.total.toLocaleString()}
              </p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Package className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
            </div>
          </div>
        </div>

        {/* Limited Editions */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-purple-500/10 group hover:border-purple-500/30 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 group-hover:text-purple-300 transition-colors">Limited Editions</p>
              <p className="text-2xl font-bold text-purple-300 group-hover:text-purple-200 transition-colors">
                {stats.limited.toLocaleString()}
              </p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
            </div>
          </div>
        </div>

        {/* Pre-Orders */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-pink-500/10 group hover:border-pink-500/30 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 group-hover:text-pink-300 transition-colors">Pre-Orders</p>
              <p className="text-2xl font-bold text-pink-300 group-hover:text-pink-200 transition-colors">
                {stats.preOrder.toLocaleString()}
              </p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500/20 to-pink-600/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5 text-pink-400 group-hover:text-pink-300 transition-colors" />
            </div>
          </div>
        </div>

        {/* New This Week */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-green-500/10 group hover:border-green-500/30 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 group-hover:text-green-300 transition-colors">New This Week</p>
              <p className="text-2xl font-bold text-green-300 group-hover:text-green-200 transition-colors">
                {stats.newItems.toLocaleString()}
              </p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5 text-green-400 group-hover:text-green-300 transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
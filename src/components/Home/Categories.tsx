'use client';

import { ChevronRight } from 'lucide-react';

const categories = [
  { id: 'cyberpunk', name: 'Cyberpunk', count: 42, icon: '💻', color: 'from-cyan-500 to-blue-600' },
  { id: 'mecha', name: 'Mecha', count: 28, icon: '🤖', color: 'from-orange-500 to-red-600' },
  { id: 'fantasy', name: 'Fantasy', count: 35, icon: '🔮', color: 'from-purple-500 to-pink-600' },
  { id: 'sci-fi', name: 'Sci-Fi', count: 31, icon: '🚀', color: 'from-green-500 to-emerald-600' },
];

export function CategoriesSection() {
  return (
    <section className="py-8 md:py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">
            <span className="bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
              Browse Categories
            </span>
          </h2>
          <button className="text-cyan-300 hover:text-cyan-400 transition-colors flex items-center space-x-2 text-sm md:text-base">
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group relative bg-gray-900/50 rounded-xl p-4 md:p-6 border border-gray-800 hover:border-cyan-500 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            >
              <div className={`text-3xl md:text-4xl mb-3 md:mb-4 bg-gradient-to-br ${category.color} bg-clip-text text-transparent`}>
                {category.icon}
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2 group-hover:text-cyan-300 transition-colors">
                {category.name}
              </h3>
              <p className="text-gray-400 text-xs md:text-sm">{category.count} items</p>
              <div className="absolute bottom-3 md:bottom-4 right-3 md:right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center">
                  <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
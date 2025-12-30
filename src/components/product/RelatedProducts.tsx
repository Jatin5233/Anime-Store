import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface RelatedProduct {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface RelatedProductsProps {
  title?: string;
  viewAllLink?: string;
  products: RelatedProduct[];
}

export default function RelatedProducts({
  title = "Related Products",
  viewAllLink = "/collections",
  products
}: RelatedProductsProps) {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        {viewAllLink && (
          <Link
            href={viewAllLink}
            className="text-cyan-300 hover:text-cyan-200 transition-colors flex items-center space-x-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="group bg-gray-900/50 backdrop-blur-sm rounded-xl border border-cyan-500/10 overflow-hidden hover:border-cyan-500/30 transition-all"
          >
            <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900"></div>
            <div className="p-4">
              <p className="font-semibold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                {product.name}
              </p>
              <p className="text-sm text-cyan-400 mt-1">${product.price.toFixed(2)}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
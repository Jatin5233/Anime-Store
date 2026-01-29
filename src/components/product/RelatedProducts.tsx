'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import {ProductCard} from '../Collections/ProductCard';

export default function RelatedProducts({ anime }: { anime: string }) {
  const [products, setProducts] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    api.get('/products', { params: { anime } }).then(res => {
      setProducts(res.data.products.slice(0, 4));
    });
  }, [anime]);

  if (products.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Related Products</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map(p => (
          <ProductCard
            key={p._id}
            product={p}
            onClick={(slug) => router.push(`/product/${slug}`)}
          />
        ))}
      </div>
    </div>
  );
}

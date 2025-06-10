'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '@/types';

interface RelatedProductsProps {
  category: string;
  currentProductId: string;
}

export function RelatedProducts({ category, currentProductId }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const relatedProducts: Product[] = [
        {
          id: '2',
          name: 'Smart Fitness Watch',
          price: 199.99,
          originalPrice: 249.99,
          image: 'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=600',
          category: 'Electronics',
          rating: 4.6,
          reviews: 89,
          description: 'Advanced fitness tracking with heart rate monitoring and GPS functionality.',
          inStock: true,
          featured: true
        },
        {
          id: '5',
          name: 'Wireless Charging Pad',
          price: 49.99,
          originalPrice: 69.99,
          image: 'https://images.pexels.com/photos/4039921/pexels-photo-4039921.jpeg?auto=compress&cs=tinysrgb&w=600',
          category: 'Electronics',
          rating: 4.4,
          reviews: 32,
          description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
          inStock: true,
          featured: false
        },
        {
          id: '7',
          name: 'Bluetooth Speaker',
          price: 79.99,
          originalPrice: 99.99,
          image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=600',
          category: 'Electronics',
          rating: 4.3,
          reviews: 67,
          description: 'Portable Bluetooth speaker with 360-degree sound and waterproof design.',
          inStock: true,
          featured: false
        }
      ].filter(product => product.id !== currentProductId);
      
      setProducts(relatedProducts);
      setLoading(false);
    };

    fetchRelatedProducts();
  }, [category, currentProductId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-80"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
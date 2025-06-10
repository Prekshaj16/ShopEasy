'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/types';

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchFeaturedProducts = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const featuredProducts: Product[] = [
        {
          id: '1',
          name: 'Premium Wireless Headphones',
          price: 299.99,
          originalPrice: 399.99,
          image: 'https://images.pexels.com/photos/3394659/pexels-photo-3394659.jpeg?auto=compress&cs=tinysrgb&w=600',
          category: 'Electronics',
          rating: 4.8,
          reviews: 124,
          description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
          inStock: true,
          featured: true
        },
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
          id: '3',
          name: 'Minimalist Desk Lamp',
          price: 89.99,
          originalPrice: 119.99,
          image: 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=600',
          category: 'Home & Office',
          rating: 4.7,
          reviews: 56,
          description: 'Modern LED desk lamp with adjustable brightness and wireless charging base.',
          inStock: true,
          featured: true
        },
        {
          id: '4',
          name: 'Leather Messenger Bag',
          price: 149.99,
          originalPrice: 199.99,
          image: 'https://www.drakensberg.in/cdn/shop/files/DRAKENSBERG-Messenger-Bag-Leon-Havanna-Braun-Umhaengetasche-Aktentasche-Schultertasche-Perspektive-4200-409.jpg?v=1712092982',
          category: 'Fashion',
          rating: 4.9,
          reviews: 78,
          description: 'Handcrafted genuine leather messenger bag perfect for professionals.',
          inStock: true,
          featured: true
        }
      ];
      
      setProducts(featuredProducts);
      setLoading(false);
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium products
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-80"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium products, carefully curated for quality and style
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="text-center">
          <Link href="/products">
            <Button size="lg" variant="outline">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
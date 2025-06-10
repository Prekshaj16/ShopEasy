'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/products/ProductCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockCategories: Category[] = [
        {
          id: '1',
          name: 'Electronics',
          description: 'Latest gadgets and electronic devices',
          image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=600',
          productCount: 45
        },
        {
          id: '2',
          name: 'Fashion',
          description: 'Trendy clothing and accessories',
          image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=600',
          productCount: 32
        },
        {
          id: '3',
          name: 'Home & Office',
          description: 'Furniture and office supplies',
          image: 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=600',
          productCount: 28
        },
        {
          id: '4',
          name: 'Home & Kitchen',
          description: 'Kitchen appliances and home essentials',
          image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=600',
          productCount: 19
        }
      ];

      const mockFeaturedProducts: Product[] = [
        {
          id: '1',
          name: 'Premium Wireless Headphones',
          price: 299.99,
          originalPrice: 399.99,
          image: 'https://images.pexels.com/photos/3394659/pexels-photo-3394659.jpeg?auto=compress&cs=tinysrgb&w=600',
          category: 'Electronics',
          rating: 4.8,
          reviews: 124,
          description: 'High-quality wireless headphones with noise cancellation.',
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
          description: 'Advanced fitness tracking with heart rate monitoring.',
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
          description: 'Modern LED desk lamp with adjustable brightness.',
          inStock: true,
          featured: true
        },
        {
          id: '4',
          name: 'Leather Messenger Bag',
          price: 149.99,
          originalPrice: 199.99,
          image: 'https://images.pexels.com/photos/2422476/pexels-photo-2422476.jpeg?auto=compress&cs=tinysrgb&w=600',
          category: 'Fashion',
          rating: 4.9,
          reviews: 78,
          description: 'Handcrafted genuine leather messenger bag.',
          inStock: true,
          featured: true
        }
      ];
      
      setCategories(mockCategories);
      setFeaturedProducts(mockFeaturedProducts);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-64"></div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our wide range of products organized by category. Find exactly what you're looking for.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {categories.map((category) => (
            <Card key={category.id} className="group cursor-pointer hover:shadow-lg transition-all duration-200">
              <div className="relative aspect-square overflow-hidden rounded-t-lg">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <span className="text-white font-semibold">View Products</span>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  <Badge variant="secondary">{category.productCount}</Badge>
                </div>
                <p className="text-gray-600 text-sm">{category.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
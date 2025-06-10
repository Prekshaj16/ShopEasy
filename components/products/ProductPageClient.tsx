'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductGallery } from '@/components/products/ProductGallery';
import { ProductInfo } from '@/components/products/ProductInfo';
import { ProductReviews } from '@/components/products/ProductReviews';
import { RelatedProducts } from '@/components/products/RelatedProducts';
import { Product } from '@/types';

export default function ProductPageClient({ id }: { id: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay

      const mockProduct: Product = {
        id,
        name: 'Premium Wireless Headphones',
        price: 299.99,
        originalPrice: 399.99,
        image: 'https://images.pexels.com/photos/3394659/pexels-photo-3394659.jpeg?auto=compress&cs=tinysrgb&w=800',
        category: 'Electronics',
        rating: 4.8,
        reviews: 124,
        description: 'Experience superior sound quality with our premium wireless headphones...',
        inStock: true,
        featured: true,
        images: [
          'https://images.pexels.com/photos/3394659/pexels-photo-3394659.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/3394651/pexels-photo-3394651.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        specifications: {
          'Driver Size': '40mm',
          'Frequency Response': '20Hz - 20kHz',
          'Battery Life': '30 hours',
          'Charging Time': '2 hours',
          'Weight': '250g',
          'Connectivity': 'Bluetooth 5.0, USB-C'
        }
      };

      setProduct(mockProduct);
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-gray-200 rounded-lg h-96"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-10 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600">The product you're looking for doesn't exist.</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <ProductGallery images={product.images || [product.image]} />
          <ProductInfo product={product} />
        </div>
        <ProductReviews productId={product.id} />
        <RelatedProducts category={product.category} currentProductId={product.id} />
      </main>
      <Footer />
    </div>
  );
}

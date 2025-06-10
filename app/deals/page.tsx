'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/products/ProductCard';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Timer, Zap, Gift, Star } from 'lucide-react';
import { Product } from '@/types';

interface Deal {
  id: string;
  title: string;
  description: string;
  discount: number;
  endTime: string;
  products: Product[];
  type: 'flash' | 'daily' | 'weekly';
}

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeals = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockDeals: Deal[] = [
        {
          id: '1',
          title: 'Flash Sale',
          description: 'Limited time offers on electronics',
          discount: 50,
          endTime: '2024-12-31T23:59:59',
          type: 'flash',
          products: [
            {
              id: '1',
              name: 'Premium Wireless Headphones',
              price: 149.99,
              originalPrice: 299.99,
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
              price: 99.99,
              originalPrice: 199.99,
              image: 'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=600',
              category: 'Electronics',
              rating: 4.6,
              reviews: 89,
              description: 'Advanced fitness tracking with heart rate monitoring.',
              inStock: true,
              featured: true
            }
          ]
        },
        {
          id: '2',
          title: 'Daily Deals',
          description: 'New deals every day',
          discount: 30,
          endTime: '2024-12-25T23:59:59',
          type: 'daily',
          products: [
            {
              id: '3',
              name: 'Minimalist Desk Lamp',
              price: 62.99,
              originalPrice: 89.99,
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
              price: 104.99,
              originalPrice: 149.99,
              image: 'https://images.pexels.com/photos/2422476/pexels-photo-2422476.jpeg?auto=compress&cs=tinysrgb&w=600',
              category: 'Fashion',
              rating: 4.9,
              reviews: 78,
              description: 'Handcrafted genuine leather messenger bag.',
              inStock: true,
              featured: true
            }
          ]
        }
      ];
      
      setDeals(mockDeals);
      setLoading(false);
    };

    fetchDeals();
  }, []);

  const getTimeRemaining = (endTime: string) => {
    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    const difference = end - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      
      return { days, hours, minutes };
    }
    
    return { days: 0, hours: 0, minutes: 0 };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="space-y-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-96"></div>
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Special Deals & Offers</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't miss out on our amazing deals! Limited time offers with incredible savings.
          </p>
        </div>

        <div className="space-y-12">
          {deals.map((deal) => {
            const timeRemaining = getTimeRemaining(deal.endTime);
            const dealIcon = deal.type === 'flash' ? Zap : deal.type === 'daily' ? Gift : Star;
            const DealIcon = dealIcon;

            return (
              <Card key={deal.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <DealIcon className="h-8 w-8" />
                      <div>
                        <CardTitle className="text-2xl">{deal.title}</CardTitle>
                        <p className="text-red-100">{deal.description}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-lg px-4 py-2 bg-white text-red-600">
                      Up to {deal.discount}% OFF
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-6 mt-4">
                    <div className="flex items-center space-x-2">
                      <Timer className="h-5 w-5" />
                      <span className="font-semibold">Time Remaining:</span>
                    </div>
                    <div className="flex space-x-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{timeRemaining.days}</div>
                        <div className="text-sm">Days</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{timeRemaining.hours}</div>
                        <div className="text-sm">Hours</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{timeRemaining.minutes}</div>
                        <div className="text-sm">Minutes</div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {deal.products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
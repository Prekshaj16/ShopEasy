'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Discover
              <span className="text-blue-600 block">Premium Products</span>
              for Modern Living
            </h1>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
              Experience the finest collection of curated products designed for the modern lifestyle. 
              Quality meets innovation in every item we offer.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <Button size="lg" className="w-full sm:w-auto">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/categories">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Browse Categories
                </Button>
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">10K+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600">Premium Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">4.9</div>
                <div className="text-sm text-gray-600">Customer Rating</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200">
              <img
                src="https://www.boat-lifestyle.com/cdn/shop/products/eb8e0fbd-c412-48b3-9c91-5b49ddf35800.png?v=1673002681"
                alt="Premium Products"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
              NEW
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Menu, X, Search, User, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Badge } from '@/components/ui/badge';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getTotalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">SE</span>
              </div>
              <span className="hidden font-bold sm:inline-block text-xl">ShopEasy</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/products" className="text-sm font-medium transition-colors hover:text-primary">
              Products
            </Link>
            <Link href="/categories" className="text-sm font-medium transition-colors hover:text-primary">
              Categories
            </Link>
            <Link href="/deals" className="text-sm font-medium transition-colors hover:text-primary">
              Deals
            </Link>
            <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
              About
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Search className="h-4 w-4" />
            </Button>
            
            <Link href="/auth/login">
              <Button variant="ghost" size="icon">
                <User className="h-4 w-4" />
              </Button>
            </Link>
            
            <Button variant="ghost" size="icon">
              <Heart className="h-4 w-4" />
            </Button>
            
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-4 w-4" />
                {getTotalItems() > 0 && (
                  <Badge variant="destructive\" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              <Link href="/products" className="block px-3 py-2 text-base font-medium transition-colors hover:text-primary">
                Products
              </Link>
              <Link href="/categories" className="block px-3 py-2 text-base font-medium transition-colors hover:text-primary">
                Categories
              </Link>
              <Link href="/deals" className="block px-3 py-2 text-base font-medium transition-colors hover:text-primary">
                Deals
              </Link>
              <Link href="/about" className="block px-3 py-2 text-base font-medium transition-colors hover:text-primary">
                About
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
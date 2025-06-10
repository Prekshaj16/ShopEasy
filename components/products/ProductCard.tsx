'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
  };

  const discountPercentage = product.originalPrice ? 
    Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <Link href={`/products/${product.id}`}>
      <div className="group relative bg-card rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {discountPercentage > 0 && (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-500">
              -{discountPercentage}%
            </Badge>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 h-8 w-8 ${
              isWishlisted ? 'text-red-500' : 'text-gray-400'
            } hover:text-red-500 bg-white/80 backdrop-blur-sm`}
            onClick={handleWishlist}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </Button>
          
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleAddToCart}
              className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="text-sm text-muted-foreground mb-1">{product.category}</div>
          <h3 className="font-semibold text-card-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-1 mb-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-sm text-muted-foreground">({product.reviews})</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-card-foreground">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            
            {!product.inStock && (
              <Badge variant="secondary">Out of Stock</Badge>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
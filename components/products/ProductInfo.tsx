'use client';

import { useState } from 'react';
import { Star, Heart, ShoppingCart, Minus, Plus, Truck, Shield, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const discountPercentage = product.originalPrice ? 
    Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm text-muted-foreground mb-2">{product.category}</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{product.rating}</span>
            <span className="text-muted-foreground">({product.reviews} reviews)</span>
          </div>
          {product.inStock ? (
            <Badge variant="secondary" className="text-green-600">In Stock</Badge>
          ) : (
            <Badge variant="destructive">Out of Stock</Badge>
          )}
        </div>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="text-3xl font-bold text-gray-900">${product.price}</div>
          {product.originalPrice && (
            <>
              <div className="text-xl text-muted-foreground line-through">${product.originalPrice}</div>
              <Badge className="bg-red-500 hover:bg-red-500">-{discountPercentage}%</Badge>
            </>
          )}
        </div>
      </div>

      <Separator />

      <div>
        <p className="text-gray-600 leading-relaxed">{product.description}</p>
      </div>

      {product.specifications && (
        <>
          <Separator />
          <div>
            <h3 className="font-semibold mb-3">Specifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between py-1">
                  <span className="text-muted-foreground">{key}:</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <span className="font-medium">Quantity:</span>
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="px-4 py-2 font-medium">{quantity}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex space-x-4">
          <Button
            size="lg"
            className="flex-1"
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => setIsWishlisted(!isWishlisted)}
            className={isWishlisted ? 'text-red-500 border-red-200' : ''}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Truck className="h-5 w-5 text-green-600" />
          <div>
            <div className="font-medium">Free Shipping</div>
            <div className="text-sm text-muted-foreground">On orders over $100</div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Shield className="h-5 w-5 text-blue-600" />
          <div>
            <div className="font-medium">2 Year Warranty</div>
            <div className="text-sm text-muted-foreground">Manufacturer warranty included</div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <RotateCcw className="h-5 w-5 text-orange-600" />
          <div>
            <div className="font-medium">30-Day Returns</div>
            <div className="text-sm text-muted-foreground">Hassle-free returns</div>
          </div>
        </div>
      </div>
    </div>
  );
}
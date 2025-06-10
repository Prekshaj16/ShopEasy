'use client';

import { useState } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CartItem as CartItemType } from '@/types';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(item.id);
    } else {
      updateQuantity(item.id, newQuantity);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <img
              src={item.product.image}
              alt={item.product.name}
              className="w-20 h-20 object-cover rounded-md"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <Link href={`/products/${item.product.id}`}>
              <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                {item.product.name}
              </h3>
            </Link>
            <p className="text-sm text-gray-500">{item.product.category}</p>
            <div className="mt-2">
              <span className="text-lg font-bold text-gray-900">${item.product.price}</span>
              {item.product.originalPrice && (
                <span className="ml-2 text-sm text-gray-500 line-through">
                  ${item.product.originalPrice}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleQuantityChange(item.quantity - 1)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="px-4 py-2 font-medium">{item.quantity}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleQuantityChange(item.quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeFromCart(item.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">
              ${(item.product.price * item.quantity).toFixed(2)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
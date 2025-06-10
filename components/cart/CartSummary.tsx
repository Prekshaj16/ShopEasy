'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';

export function CartSummary() {
  const { getSubtotal, getTotalItems } = useCart();
  
  const subtotal = getSubtotal();
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span>Subtotal ({getTotalItems()} items)</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        
        <Separator />
        
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        
        {shipping === 0 && (
          <div className="text-sm text-green-600 text-center">
            🎉 You saved $9.99 on shipping!
          </div>
        )}
        
        <Link href="/checkout" className="block">
          <Button size="lg" className="w-full">
            Proceed to Checkout
          </Button>
        </Link>
        
        <Link href="/products" className="block">
          <Button variant="outline" size="lg" className="w-full">
            Continue Shopping
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
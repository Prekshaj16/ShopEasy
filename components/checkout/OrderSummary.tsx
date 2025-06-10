'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';

export function OrderSummary() {
  const { items, getSubtotal, getTotalItems } = useCart();
  
  const subtotal = getSubtotal();
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {items.map((item) => (
            <div key={`${item.product.id}-${item.id}`} className="flex items-center space-x-3">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-12 h-12 object-cover rounded-md"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.product.name}
                </p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-medium">
                ${(item.product.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
        
        <Separator />
        
        <div className="space-y-2">
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
      </CardContent>
    </Card>
  );
}
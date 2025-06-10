'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreditCard, MapPin, User } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { ordersAPI, paymentAPI } from '@/lib/api';
import { toast } from 'sonner';

const checkoutSchema = z.object({
  // Personal Information
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  
  // Shipping Address
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(5, 'Zip code must be at least 5 digits'),
  country: z.string().min(1, 'Country is required'),
  
  // Payment Method
  paymentMethod: z.enum(['razorpay', 'cod']),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function CheckoutForm() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { items, getSubtotal, clearCart } = useCart();
  const { user } = useAuth();
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: user?.email || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      paymentMethod: 'razorpay'
    }
  });

  const paymentMethod = watch('paymentMethod');

  const onSubmit = async (data: CheckoutFormData) => {
    setIsProcessing(true);
    
    try {
      const subtotal = getSubtotal();
      const shippingCost = subtotal > 100 ? 0 : 9.99;
      const tax = subtotal * 0.08;
      const total = subtotal + shippingCost + tax;

      // Create order
      const orderData = {
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        })),
        shippingAddress: {
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country,
          phone: data.phone
        },
        paymentMethod: data.paymentMethod,
        subtotal,
        shippingCost,
        tax,
        total
      };

      const orderResponse = await ordersAPI.create(orderData);
      const order = orderResponse.data.data;

      if (data.paymentMethod === 'razorpay') {
        // Create Razorpay order
        const razorpayResponse = await paymentAPI.createOrder({
          amount: total,
          orderId: order._id
        });

        const { orderId, amount, currency, key } = razorpayResponse.data.data;

        // Initialize Razorpay
        const options = {
          key,
          amount,
          currency,
          name: 'ModernShop',
          description: `Order #${order.orderNumber}`,
          order_id: orderId,
          handler: async (response: any) => {
            try {
              // Verify payment
              await paymentAPI.verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: order._id
              });

              clearCart();
              toast.success('Payment successful! Order placed.');
              window.location.href = `/dashboard?tab=orders`;
            } catch (error) {
              toast.error('Payment verification failed');
            }
          },
          prefill: {
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            contact: data.phone
          },
          theme: {
            color: '#000000'
          },
          modal: {
            ondismiss: () => {
              setIsProcessing(false);
            }
          }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        // Cash on Delivery
        clearCart();
        toast.success('Order placed successfully! You can pay on delivery.');
        window.location.href = `/dashboard?tab=orders`;
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to place order';
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                {...register('firstName')}
                className={errors.firstName ? 'border-red-500' : ''}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                {...register('lastName')}
                className={errors.lastName ? 'border-red-500' : ''}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              {...register('phone')}
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && (
              <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Shipping Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Shipping Address
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="address">Street Address</Label>
            <Input
              id="address"
              {...register('address')}
              className={errors.address ? 'border-red-500' : ''}
            />
            {errors.address && (
              <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                {...register('city')}
                className={errors.city ? 'border-red-500' : ''}
              />
              {errors.city && (
                <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                {...register('state')}
                className={errors.state ? 'border-red-500' : ''}
              />
              {errors.state && (
                <p className="text-sm text-red-500 mt-1">{errors.state.message}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="zipCode">Zip Code</Label>
              <Input
                id="zipCode"
                {...register('zipCode')}
                className={errors.zipCode ? 'border-red-500' : ''}
              />
              {errors.zipCode && (
                <p className="text-sm text-red-500 mt-1">{errors.zipCode.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                {...register('country')}
                className={errors.country ? 'border-red-500' : ''}
              />
              {errors.country && (
                <p className="text-sm text-red-500 mt-1">{errors.country.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={paymentMethod}
            onValueChange={(value) => register('paymentMethod').onChange({ target: { value } })}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="razorpay" id="razorpay" />
              <Label htmlFor="razorpay" className="flex-1 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Online Payment</div>
                    <div className="text-sm text-gray-600">Pay securely with Razorpay</div>
                  </div>
                  <CreditCard className="h-5 w-5 text-gray-400" />
                </div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="cod" id="cod" />
              <Label htmlFor="cod" className="flex-1 cursor-pointer">
                <div>
                  <div className="font-medium">Cash on Delivery</div>
                  <div className="text-sm text-gray-600">Pay when you receive your order</div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Place Order'}
      </Button>

      {/* Razorpay Script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />
    </form>
  );
}
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="py-16 bg-blue-600">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto">
          <Mail className="h-12 w-12 text-blue-100 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Updated with Latest Deals
          </h2>
          <p className="text-blue-100 mb-8">
            Subscribe to our newsletter and get exclusive offers, new product announcements, and style tips delivered to your inbox.
          </p>
          
          {subscribed ? (
            <div className="bg-green-500 text-white p-4 rounded-lg">
              Thanks for subscribing! Check your email for confirmation.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-white"
              />
              <Button type="submit" variant="secondary" className="whitespace-nowrap">
                Subscribe
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
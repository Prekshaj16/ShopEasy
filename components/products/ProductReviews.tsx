'use client';

import { useState, useEffect } from 'react';
import { Star, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

interface ProductReviewsProps {
  productId: string;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockReviews: Review[] = [
        {
          id: '1',
          user: 'Sarah Johnson',
          rating: 5,
          comment: 'Absolutely love these headphones! The sound quality is incredible and they\'re so comfortable to wear for long periods.',
          date: '2024-01-15',
          helpful: 12
        },
        {
          id: '2',
          user: 'Mike Chen',
          rating: 4,
          comment: 'Great value for money. The noise cancellation works well and battery life is impressive.',
          date: '2024-01-10',
          helpful: 8
        },
        {
          id: '3',
          user: 'Emily Davis',
          rating: 5,
          comment: 'Perfect for my daily commute. The wireless connection is stable and the build quality feels premium.',
          date: '2024-01-05',
          helpful: 15
        }
      ];
      
      setReviews(mockReviews);
      setLoading(false);
    };

    fetchReviews();
  }, [productId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>
        <Button variant="outline">Write a Review</Button>
      </div>
      
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar>
                  <AvatarFallback>{review.user.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-medium">{review.user}</div>
                      <div className="text-sm text-muted-foreground">{review.date}</div>
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-3">{review.comment}</p>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Helpful ({review.helpful})
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
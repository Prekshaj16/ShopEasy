'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface ProductFiltersProps {
  filters: {
    categories: string[];
    priceRange: [number, number];
    rating: number;
  };
  onFiltersChange: (filters: any) => void;
  categories: string[];
}

export function ProductFilters({ filters, onFiltersChange, categories }: ProductFiltersProps) {
  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category);
    
    onFiltersChange({
      ...filters,
      categories: newCategories
    });
  };

  const handlePriceRangeChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      priceRange: [value[0], value[1]] as [number, number]
    });
  };

  const handleRatingChange = (rating: number) => {
    onFiltersChange({
      ...filters,
      rating: filters.rating === rating ? 0 : rating
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={filters.categories.includes(category)}
                onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
              />
              <Label htmlFor={category} className="text-sm cursor-pointer">
                {category}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Price Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Slider
              value={filters.priceRange}
              onValueChange={handlePriceRangeChange}
              max={1000}
              min={0}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Minimum Rating</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <div
              key={rating}
              className={`flex items-center space-x-2 cursor-pointer p-2 rounded ${
                filters.rating === rating ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
              onClick={() => handleRatingChange(rating)}
            >
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm">& up</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
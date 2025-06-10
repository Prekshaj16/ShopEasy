'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductFilters } from '@/components/products/ProductFilters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { Product } from '@/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    categories: [] as string[],
    priceRange: [0, 1000] as [number, number],
    rating: 0,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const allProducts: Product[] = [
        {
          id: '1',
          name: 'Premium Wireless Headphones',
          price: 299.99,
          originalPrice: 399.99,
          image: 'https://images.pexels.com/photos/3394659/pexels-photo-3394659.jpeg?auto=compress&cs=tinysrgb&w=600',
          category: 'Electronics',
          rating: 4.8,
          reviews: 124,
          description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
          inStock: true,
          featured: true
        },
        {
          id: '2',
          name: 'Smart Fitness Watch',
          price: 199.99,
          originalPrice: 249.99,
          image: 'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=600',
          category: 'Electronics',
          rating: 4.6,
          reviews: 89,
          description: 'Advanced fitness tracking with heart rate monitoring and GPS functionality.',
          inStock: true,
          featured: true
        },
        {
          id: '3',
          name: 'Minimalist Desk Lamp',
          price: 89.99,
          originalPrice: 119.99,
          image: 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=600',
          category: 'Home & Office',
          rating: 4.7,
          reviews: 56,
          description: 'Modern LED desk lamp with adjustable brightness and wireless charging base.',
          inStock: true,
          featured: true
        },
        {
          id: '4',
          name: 'Leather Messenger Bag',
          price: 149.99,
          originalPrice: 199.99,
          image: 'https://www.drakensberg.in/cdn/shop/files/DRAKENSBERG-Messenger-Bag-Leon-Havanna-Braun-Umhaengetasche-Aktentasche-Schultertasche-Perspektive-4200-409.jpg?v=1712092982',
          category: 'Fashion',
          rating: 4.9,
          reviews: 78,
          description: 'Handcrafted genuine leather messenger bag perfect for professionals.',
          inStock: true,
          featured: true
        },
        {
          id: '5',
          name: 'Wireless Charging Pad',
          price: 49.99,
          originalPrice: 69.99,
          image: 'https://images.pexels.com/photos/4039921/pexels-photo-4039921.jpeg?auto=compress&cs=tinysrgb&w=600',
          category: 'Electronics',
          rating: 4.4,
          reviews: 32,
          description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
          inStock: true,
          featured: false
        },
        {
          id: '6',
          name: 'Coffee Mug Set',
          price: 29.99,
          originalPrice: 39.99,
          image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=600',
          category: 'Home & Kitchen',
          rating: 4.5,
          reviews: 45,
          description: 'Set of 4 ceramic coffee mugs with modern design and comfortable grip.',
          inStock: true,
          featured: false
        },
        {
          id: '7',
          name: 'Bluetooth Speaker',
          price: 79.99,
          originalPrice: 99.99,
          image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=600',
          category: 'Electronics',
          rating: 4.3,
          reviews: 67,
          description: 'Portable Bluetooth speaker with 360-degree sound and waterproof design.',
          inStock: true,
          featured: false
        },
        {
          id: '8',
          name: 'Organic Cotton T-Shirt',
          price: 24.99,
          originalPrice: 34.99,
          image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=600',
          category: 'Fashion',
          rating: 4.6,
          reviews: 23,
          description: 'Comfortable organic cotton t-shirt available in multiple colors.',
          inStock: true,
          featured: false
        }
      ];
      
      setProducts(allProducts);
      setFilteredProducts(allProducts);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by categories
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product =>
        filters.categories.includes(product.category)
      );
    }

    // Filter by price range
    filtered = filtered.filter(product =>
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    // Filter by rating
    if (filters.rating > 0) {
      filtered = filtered.filter(product => product.rating >= filters.rating);
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, filters]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-80"></div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <ProductFilters
              filters={filters}
              onFiltersChange={setFilters}
              categories={['Electronics', 'Fashion', 'Home & Office', 'Home & Kitchen']}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Products ({filteredProducts.length})</h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
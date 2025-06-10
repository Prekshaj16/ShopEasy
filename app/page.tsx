import { Hero } from '@/components/home/Hero';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { Newsletter } from '@/components/home/Newsletter';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <FeaturedProducts />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
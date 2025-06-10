import { headers } from 'next/headers';
import dynamic from 'next/dynamic';

// 👇 Import the client component dynamically
const ProductPageClient = dynamic(() => import('@/components/products/ProductPageClient'), {
  ssr: false,
});

// ✅ Required for static export
export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
    { id: '7' },
    { id: '8' },
  ];
}

export default function ProductPage({ params }: { params: { id: string } }) {
  return <ProductPageClient id={params.id} />;
}

import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { FloatingActions } from '@/components/layout/FloatingActions';
import { CartProvider } from '@/lib/cart-context';
import { WishlistProvider } from '@/lib/wishlist-context';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  metadataBase: new URL('https://wonderful-food-supplements-f81x.onrender.com'),
  title: 'Wonderful Food Supplements | Premium NeoLife Store',
  description: 'Empowering your wellness journey with premium NeoLife nutritional solutions. Quality supplements for a vibrant, healthy lifestyle in Kenya and across Africa.',
  openGraph: {
    title: 'Wonderful Food Supplements',
    description: 'Empowering your wellness journey with premium NeoLife nutritional solutions across Kenya and Africa.',
    url: 'https://wonderful-food-supplements-f81x.onrender.com',
    siteName: 'Wonderful Food Supplements',
    images: [
      {
        url: '/Baobab-Tree-hero image.webp',
        width: 1200,
        height: 630,
        alt: 'Wonderful Food Supplements - Baobab Tree of Life',
      },
    ],
    locale: 'en_KE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wonderful Food Supplements',
    description: 'Premium NeoLife nutritional solutions for a vibrant, healthy lifestyle in Kenya and Africa.',
    images: ['/Baobab-Tree-hero image.webp'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <FirebaseClientProvider>
          <WishlistProvider>
            <CartProvider>
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
              <FloatingActions />
              <Toaster />
            </CartProvider>
          </WishlistProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}

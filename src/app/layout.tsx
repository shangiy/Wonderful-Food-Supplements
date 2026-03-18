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
  title: 'Wonderful Food Supplements | Premium NeoLife Store',
  description: 'Your trusted source for genuine NeoLife products in Kenya and across Africa. Boosting health and vitality through superior nutrition.',
  openGraph: {
    title: 'Wonderful Food Supplements',
    description: 'Quality NeoLife nutritional supplements for a vibrant life. Promoting wellness in Kenya.',
    url: 'https://wonderfulfood.co.ke',
    siteName: 'Wonderful Food Supplements',
    images: [
      {
        url: 'https://picsum.photos/seed/banyan/1200/630',
        width: 1200,
        height: 630,
        alt: 'Wonderful Food Supplements Logo',
      },
    ],
    locale: 'en_KE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wonderful Food Supplements',
    description: 'Premium NeoLife nutritional solutions in Kenya.',
    images: ['https://picsum.photos/seed/banyan/1200/630'],
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

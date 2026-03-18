"use client";

import Link from "next/link";
import { Heart, ShoppingCart, ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/lib/wishlist-context";
import { useCart } from "@/lib/cart-context";
import { ProductCard } from "@/components/products/ProductCard";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, wishlistCount } = useWishlist();
  const { addToCart } = useCart();

  if (wishlistCount === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto">
          <div className="h-24 w-24 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground">
            <Heart className="h-12 w-12" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Your wishlist is empty</h1>
          <p className="text-muted-foreground mb-8">Save products you love to your wishlist and they will show up here for later.</p>
          <Button size="lg" className="rounded-full px-8 font-bold" asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-10">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/products"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <h1 className="text-3xl font-bold">My Wishlist</h1>
        <span className="text-muted-foreground">({wishlistCount} items)</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <div key={product.id} className="relative group">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}

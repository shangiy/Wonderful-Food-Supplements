"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, Heart, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/store";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isFavorited = isInWishlist(product.id);

  const isAvailable = product.status === 'optimal' || !product.status;

  return (
    <Card className="group overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300 bg-white flex flex-col h-full">
      <div className="relative aspect-square overflow-hidden bg-secondary/20">
        <Link href={`/products/${product.id}`}>
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className={cn(
              "object-cover group-hover:scale-105 transition-transform duration-500",
              !isAvailable && "grayscale opacity-50"
            )}
            data-ai-hint="supplement product"
          />
        </Link>
        <Button 
          variant="secondary" 
          size="icon" 
          className={cn(
            "absolute top-2 right-2 h-8 w-8 rounded-full transition-all bg-white/80 backdrop-blur",
            isFavorited ? "opacity-100 text-red-500 fill-current" : "opacity-0 group-hover:opacity-100 text-muted-foreground"
          )}
          onClick={() => toggleWishlist(product)}
        >
          <Heart className="h-4 w-4" />
        </Button>
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.featured && (
            <Badge className="bg-accent text-accent-foreground border-none">Best Seller</Badge>
          )}
          {!isAvailable && (
            <Badge variant="destructive" className="border-none gap-1">
              <AlertTriangle className="h-3 w-3" />
              {product.status === 'out-of-stock' ? 'Out of Stock' : 'Discontinued'}
            </Badge>
          )}
        </div>
      </div>
      <CardContent className="p-4 flex-grow">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 font-medium">{product.category}</p>
        <Link href={`/products/${product.id}`}>
          <h3 className="font-bold text-sm line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
        </Link>
        <p className="text-xs text-muted-foreground line-clamp-2 mt-1 mb-2 h-8">
          {product.description}
        </p>
        <p className="font-bold text-primary">KES {product.price.toLocaleString()}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full gap-2 text-sm h-9 rounded-full" 
          variant={isAvailable ? "default" : "secondary"}
          onClick={() => isAvailable && addToCart(product)}
          disabled={!isAvailable}
        >
          {isAvailable ? (
            <>
              <Plus className="h-4 w-4" />
              Add to Cart
            </>
          ) : (
            'Unavailable'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

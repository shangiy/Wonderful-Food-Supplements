"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/store";
import { useCart } from "@/lib/cart-context";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <Card className="group overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300 bg-white flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-secondary/20">
        <Link href={`/products/${product.id}`}>
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            data-ai-hint="supplement product"
          />
        </Link>
        <Button 
          variant="secondary" 
          size="icon" 
          className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur"
        >
          <Heart className="h-4 w-4" />
        </Button>
        {product.featured && (
          <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground">Best Seller</Badge>
        )}
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
          variant="default"
          onClick={() => addToCart(product)}
        >
          <Plus className="h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}

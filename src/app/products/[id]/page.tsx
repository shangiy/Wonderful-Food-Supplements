"use client";

import Image from "next/image";
import { notFound } from "next/navigation";
import { products } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Truck, ShieldCheck, ShoppingCart, Heart } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import React from "react";
import { cn } from "@/lib/utils";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  if (!product) {
    notFound();
  }

  const isFavorited = isInWishlist(product.id);

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-secondary/20">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              priority
              data-ai-hint="product detail image"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
             {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-square relative rounded-xl overflow-hidden bg-secondary/30 border border-transparent hover:border-primary transition-colors cursor-pointer">
                   <Image src={product.imageUrl} alt="thumbnail" fill className="object-cover opacity-60 hover:opacity-100" />
                </div>
             ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="uppercase tracking-widest text-[10px]">{product.category}</Badge>
              <div className="flex items-center text-accent fill-accent">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-3 w-3 fill-current" />)}
                <span className="text-xs text-muted-foreground ml-2">(48 Reviews)</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-4">{product.name}</h1>
            <p className="text-2xl font-bold text-primary">KES {product.price.toLocaleString()}</p>
          </div>

          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            {product.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <Button 
              size="lg" 
              className="flex-grow gap-2 rounded-full h-14 text-lg font-bold"
              onClick={() => addToCart(product)}
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className={cn(
                "h-14 w-14 rounded-full p-0 transition-colors",
                isFavorited && "text-red-500 fill-current border-red-200"
              )}
              onClick={() => toggleWishlist(product)}
            >
              <Heart className="h-6 w-6" />
            </Button>
          </div>

          <div className="space-y-4 pt-6 border-t">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-secondary/50 flex items-center justify-center text-primary">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold">Fast Delivery</p>
                <p className="text-xs text-muted-foreground">Same day delivery in Nairobi</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-secondary/50 flex items-center justify-center text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold">100% Genuine</p>
                <p className="text-xs text-muted-foreground">Authentic NeoLife nutritional products</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <Tabs defaultValue="benefits" className="w-full">
          <TabsList className="w-full justify-start bg-transparent border-b rounded-none h-12 p-0 gap-8">
            <TabsTrigger 
              value="benefits" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none font-bold text-lg h-full px-0"
            >
              Benefits
            </TabsTrigger>
            <TabsTrigger 
              value="ingredients" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none font-bold text-lg h-full px-0"
            >
              Ingredients
            </TabsTrigger>
            <TabsTrigger 
              value="reviews" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none font-bold text-lg h-full px-0"
            >
              Reviews (48)
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="benefits" className="py-10">
            <ul className="space-y-4">
              {product.benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center text-primary mt-0.5">
                    <Star className="h-3 w-3 fill-current" />
                  </div>
                  <span className="text-lg text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </TabsContent>
          
          <TabsContent value="ingredients" className="py-10">
            <div className="prose max-w-none text-muted-foreground">
              <p className="text-lg mb-4">Each serving of {product.name} contains premium quality ingredients selected for maximum bio-availability:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {product.ingredients.map((ing, i) => (
                  <div key={i} className="p-4 bg-secondary/30 rounded-xl font-medium text-center">
                    {ing}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="py-10">
             <div className="space-y-8 max-w-3xl">
                {[1, 2].map(i => (
                   <div key={i} className="space-y-2">
                      <div className="flex items-center gap-2">
                         <div className="flex text-accent h-4"><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /></div>
                         <span className="font-bold">Excellent Product</span>
                      </div>
                      <p className="text-muted-foreground italic">"This supplement has changed my life. I feel more energetic and focused throughout the day. Highly recommended for anyone looking to improve their daily nutrition."</p>
                      <p className="text-xs font-medium">— Sarah K., Nairobi</p>
                      <Separator />
                   </div>
                ))}
             </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

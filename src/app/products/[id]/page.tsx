"use client";

import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import { products } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Truck, ShieldCheck, ShoppingCart, Heart, Send, Loader2, Lock, ShoppingBag } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import React, { useState, useMemo, use } from "react";
import { cn } from "@/lib/utils";
import { useFirestore, useUser, useCollection } from "@/firebase";
import { collection, addDoc, serverTimestamp, query, where, orderBy } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = products.find((p) => p.id === id);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const router = useRouter();
  const { toast } = useToast();
  const { db } = useFirestore();
  const { user } = useUser();

  // Review Form State
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!product) {
    notFound();
  }

  const isFavorited = isInWishlist(product.id);

  // Fetch Published Reviews from Firestore
  const reviewsQuery = useMemo(() => {
    if (!db) return null;
    return query(
      collection(db, "reviews"),
      where("productId", "==", product.id),
      where("status", "==", "published"),
      orderBy("createdAt", "desc")
    );
  }, [db, product.id]);

  const { data: dbReviews, loading: reviewsLoading } = useCollection(reviewsQuery);

  const handleAction = () => {
    addToCart(product);
    if (isFavorited) {
      router.push('/checkout');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !user) return;
    if (!comment.trim()) {
      toast({ title: "Comment required", description: "Please share your thoughts about the product.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "reviews"), {
        productId: product.id,
        userId: user.uid,
        userName: user.displayName || "Member",
        userLocation: "Member Location",
        rating,
        title,
        comment,
        status: "pending", 
        createdAt: serverTimestamp(),
      });

      toast({
        title: "Review Submitted",
        description: "Thank you! Your review is being moderated and will appear once approved.",
      });
      
      setTitle("");
      setComment("");
      setRating(5);
    } catch (error: any) {
      toast({ title: "Submission failed", description: "Could not save your review. Please try again later.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

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
                   <Image 
                     src={product.imageUrl} 
                     alt="thumbnail" 
                     fill 
                     className={cn(
                       "object-cover opacity-60 hover:opacity-100",
                       i === 2 && "rotate-90"
                     )} 
                   />
                </div>
             ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="uppercase tracking-widest text-[10px]">{product.category}</Badge>
              <div className="flex items-center text-accent">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className={cn("h-3 w-3 fill-current", i <= 5 ? "text-accent" : "text-muted")} />)}
                <span className="text-xs text-muted-foreground ml-2">({dbReviews?.length || 0} Dynamic Reviews)</span>
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
              onClick={handleAction}
            >
              {isFavorited ? <ShoppingBag className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
              {isFavorited ? 'Buy Now' : 'Add to Cart'}
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
              Reviews ({dbReviews?.length || 0})
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-8">
                {reviewsLoading ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading reviews...
                  </div>
                ) : dbReviews && dbReviews.length > 0 ? (
                  dbReviews.map((review: any, i: number) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="flex text-accent h-4">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star key={idx} className={cn("h-4 w-4", idx < review.rating ? "fill-current" : "text-muted")} />
                          ))}
                        </div>
                        <span className="font-bold">{review.title}</span>
                      </div>
                      <p className="text-muted-foreground italic">"{review.comment}"</p>
                      <p className="text-xs font-medium">— {review.userName}, {review.userLocation}</p>
                      <Separator className="mt-4" />
                    </div>
                  ))
                ) : (
                  <div className="p-8 border-2 border-dashed rounded-3xl text-center text-muted-foreground">
                    <p>No reviews yet. Be the first to share your experience!</p>
                  </div>
                )}
              </div>

              <Card className="border-none shadow-lg bg-secondary/10 rounded-3xl h-fit sticky top-24">
                <CardHeader>
                  <CardTitle className="text-xl">Write a Review</CardTitle>
                  <CardDescription>Share your feedback with other customers</CardDescription>
                </CardHeader>
                <CardContent>
                  {user ? (
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Rating</Label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              className="focus:outline-none transition-transform hover:scale-110"
                            >
                              <Star className={cn("h-6 w-6", star <= rating ? "text-accent fill-current" : "text-muted")} />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="rev-title">Review Title</Label>
                        <Input id="rev-title" placeholder="Highly Effective!" value={title} onChange={(e) => setTitle(e.target.value)} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="rev-comment">Your Experience</Label>
                        <Textarea 
                          id="rev-comment" 
                          placeholder="Tell us how this product helped you..." 
                          className="min-h-[100px] bg-white" 
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full gap-2 rounded-full h-12" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        Submit Review
                      </Button>
                    </form>
                  ) : (
                    <div className="text-center py-6 space-y-4">
                      <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mx-auto text-muted-foreground">
                        <Lock className="h-6 w-6" />
                      </div>
                      <p className="text-sm text-muted-foreground">Please sign in to your account to leave a review.</p>
                      <Button asChild className="w-full rounded-full">
                        <Link href="/account">Sign In</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
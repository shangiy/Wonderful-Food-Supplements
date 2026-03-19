"use client";

import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import { products } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Truck, ShieldCheck, ShoppingCart, Heart, Send, Loader2, Lock, ShoppingBag, Activity } from "lucide-react";
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
  const db = useFirestore();
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

  // Fetch Published Reviews from Firestore in real-time
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
    
    if (!title.trim()) {
      toast({ title: "Title required", description: "Please add a headline for your review.", variant: "destructive" });
      return;
    }
    
    if (!comment.trim()) {
      toast({ title: "Comment required", description: "Please share your thoughts about the product.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      // Direct publication for "dynamic" feel as requested
      await addDoc(collection(db, "reviews"), {
        productId: product.id,
        userId: user.uid,
        userName: user.displayName || user.email?.split('@')[0] || "Member",
        userLocation: "Verified Purchase",
        rating,
        title,
        comment,
        status: "published", 
        createdAt: serverTimestamp(),
      });

      toast({
        title: "Review Published!",
        description: "Your feedback has been added to the community catalog.",
      });
      
      setTitle("");
      setComment("");
      setRating(5);
    } catch (error: any) {
      toast({ 
        title: "Submission failed", 
        description: "Security rules or network issues prevented your post.", 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-secondary/20 shadow-inner">
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
                <div key={i} className="aspect-square relative rounded-xl overflow-hidden bg-secondary/30 border-2 border-transparent hover:border-primary transition-all cursor-pointer">
                   <Image 
                     src={product.imageUrl} 
                     alt="thumbnail" 
                     fill 
                     className={cn(
                       "object-cover opacity-60 hover:opacity-100",
                       i === 2 && "rotate-3"
                     )} 
                   />
                </div>
             ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary" className="uppercase tracking-widest text-[10px] bg-primary/10 text-primary border-none px-3 py-1">
                {product.category}
              </Badge>
              <div className="flex items-center text-accent">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className={cn("h-4 w-4 fill-current", i <= 5 ? "text-accent" : "text-muted")} />)}
                <span className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-3">
                  ({dbReviews?.length || 0} Dynamic Reviews)
                </span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-slate-900 leading-none">{product.name}</h1>
            <p className="text-3xl font-black text-primary tracking-tight">KES {product.price.toLocaleString()}</p>
          </div>

          <p className="text-muted-foreground text-lg mb-8 leading-relaxed font-medium">
            {product.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <Button 
              size="lg" 
              className="flex-grow gap-3 rounded-2xl h-16 text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform"
              onClick={handleAction}
            >
              {isFavorited ? <ShoppingBag className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
              {isFavorited ? 'Execute Buy Now' : 'Add to Hub'}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className={cn(
                "h-16 w-16 rounded-2xl p-0 transition-all border-secondary hover:bg-destructive/5 hover:border-destructive/20",
                isFavorited && "text-red-500 fill-current bg-red-50 border-red-200"
              )}
              onClick={() => toggleWishlist(product)}
            >
              <Heart className="h-6 w-6" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-8 border-t border-secondary/50">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/20">
              <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Logistics</p>
                <p className="text-sm font-black">Fast Dispatch</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/20">
              <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Integrity</p>
                <p className="text-sm font-black">100% Genuine</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <Tabs defaultValue="benefits" className="w-full">
          <TabsList className="w-full justify-start bg-transparent border-b rounded-none h-14 p-0 gap-10">
            <TabsTrigger 
              value="benefits" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none font-black uppercase text-[10px] tracking-[0.3em] h-full px-0"
            >
              Core Benefits
            </TabsTrigger>
            <TabsTrigger 
              value="ingredients" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none font-black uppercase text-[10px] tracking-[0.3em] h-full px-0"
            >
              Composition
            </TabsTrigger>
            <TabsTrigger 
              value="reviews" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none font-black uppercase text-[10px] tracking-[0.3em] h-full px-0 flex items-center gap-2"
            >
              Reviews <Badge className="bg-primary text-white border-none rounded-full h-5 min-w-[20px] px-1.5 flex items-center justify-center text-[9px] font-black">{dbReviews?.length || 0}</Badge>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="benefits" className="py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.benefits.map((benefit, i) => (
                <div key={i} className="flex items-start gap-4 p-6 bg-white border border-secondary/30 rounded-[2rem] shadow-sm">
                  <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary flex-shrink-0">
                    <Star className="h-5 w-5 fill-current" />
                  </div>
                  <span className="text-lg font-medium leading-tight">{benefit}</span>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="ingredients" className="py-12">
            <div className="space-y-6">
              <p className="text-lg font-medium text-muted-foreground">Scientifically formulated with premium whole-food extracts:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {product.ingredients.map((ing, i) => (
                  <div key={i} className="p-6 bg-secondary/30 rounded-[2rem] font-black uppercase text-[10px] tracking-widest text-center border border-white shadow-inner">
                    {ing}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              <div className="lg:col-span-2 space-y-10">
                {reviewsLoading ? (
                  <div className="flex items-center gap-3 text-primary font-black uppercase text-[10px] tracking-widest">
                    <Activity className="h-5 w-5 animate-spin" />
                    Synchronizing Reviews...
                  </div>
                ) : dbReviews && dbReviews.length > 0 ? (
                  <div className="space-y-8">
                    {dbReviews.map((review: any, i: number) => (
                      <Card key={review.id || i} className="border-none shadow-sm bg-white rounded-[2.5rem] p-8 group hover:shadow-md transition-all border border-secondary/20">
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-xs font-black text-primary">
                                {review.userName?.charAt(0)}
                              </div>
                              <div className="space-y-0.5">
                                <p className="text-sm font-black text-slate-800">{review.userName}</p>
                                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{review.userLocation}</p>
                              </div>
                            </div>
                            <div className="flex text-accent h-4">
                              {Array.from({ length: 5 }).map((_, idx) => (
                                <Star key={idx} className={cn("h-4 w-4", idx < review.rating ? "fill-current" : "text-muted")} />
                              ))}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-black text-lg tracking-tight group-hover:text-primary transition-colors">{review.title}</h4>
                            <p className="text-muted-foreground leading-relaxed italic">"{review.comment}"</p>
                          </div>
                          {review.createdAt && (
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">
                              Post Identity: {new Date(review.createdAt?.seconds * 1000).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="p-16 border-2 border-dashed border-secondary/50 rounded-[3rem] text-center space-y-4">
                    <div className="h-16 w-16 bg-secondary/20 rounded-2xl flex items-center justify-center mx-auto text-muted-foreground">
                      <Star className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-black tracking-tight">Zero Community Logs</h3>
                      <p className="text-muted-foreground text-sm">Be the first node to register feedback for this asset.</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <Card className="border-none shadow-2xl bg-white rounded-[3rem] overflow-hidden sticky top-24 border border-secondary/10">
                  <CardHeader className="p-10 pb-6 bg-secondary/30">
                    <CardTitle className="text-2xl font-black tracking-tighter">Submit Review</CardTitle>
                    <CardDescription className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Register Experience Node</CardDescription>
                  </CardHeader>
                  <CardContent className="p-10 pt-8">
                    {user ? (
                      <form onSubmit={handleSubmitReview} className="space-y-6">
                        <div className="space-y-3">
                          <Label className="font-black uppercase text-[10px] tracking-widest text-slate-500">Rating Intensity</Label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="focus:outline-none transition-all hover:scale-125"
                              >
                                <Star className={cn("h-8 w-8", star <= rating ? "text-accent fill-current" : "text-slate-200")} />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="rev-title" className="font-black uppercase text-[10px] tracking-widest text-slate-500 ml-1">Headline</Label>
                          <Input 
                            id="rev-title" 
                            placeholder="e.g. Pure Vitality!" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            className="h-14 rounded-2xl bg-secondary/40 border-none font-bold px-5"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="rev-comment" className="font-black uppercase text-[10px] tracking-widest text-slate-500 ml-1">Observation Log</Label>
                          <Textarea 
                            id="rev-comment" 
                            placeholder="Share your biological response..." 
                            className="min-h-[120px] bg-secondary/40 border-none rounded-2xl p-5 font-bold resize-none" 
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                          />
                        </div>

                        <Button 
                          type="submit" 
                          className="w-full gap-3 rounded-2xl h-16 font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-primary/20" 
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                          Publish Node
                        </Button>
                      </form>
                    ) : (
                      <div className="text-center py-10 space-y-6">
                        <div className="h-20 w-20 bg-primary/5 rounded-[2.5rem] flex items-center justify-center mx-auto text-primary border border-primary/10">
                          <Lock className="h-10 w-10" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-lg font-black tracking-tight leading-tight">Identity Required</p>
                          <p className="text-xs font-medium text-muted-foreground leading-relaxed">Authentication is required to register feedback logs in the community database.</p>
                        </div>
                        <Button asChild className="w-full rounded-2xl h-14 font-black uppercase tracking-widest text-[10px]">
                          <Link href="/account">Initialize Session</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

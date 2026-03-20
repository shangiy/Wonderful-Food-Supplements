"use client";

import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import { products, type Product } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Truck, ShieldCheck, ShoppingCart, Heart, Send, Loader2, Lock, Activity, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import React, { useState, useMemo, use, useEffect } from "react";
import { useFirestore, useUser, useCollection } from "@/firebase";
import { collection, addDoc, serverTimestamp, query, where, orderBy } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = products.find((p) => p.id === id);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const db = useFirestore();
  const { user } = useUser();
  const router = useRouter();

  // Simulated gallery using the same image for demonstration of functionality
  const [selectedIndex, setSelectedIndex] = useState(0);
  const galleryImages = product ? [product.imageUrl, product.imageUrl, product.imageUrl, product.imageUrl] : [];
  const activeImage = galleryImages[selectedIndex] || "";

  // Review Form State
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!product) {
    notFound();
  }

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

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !user) return;
    
    if (!title.trim()) {
      toast({ title: "Title required", description: "Please add a headline.", variant: "destructive" });
      return;
    }
    
    if (!comment.trim()) {
      toast({ title: "Comment required", description: "Share your experience here.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "reviews"), {
        productId: product.id,
        userId: user.uid,
        userName: user.displayName || user.email?.split('@')[0] || "Member",
        userLocation: "Verified Member",
        rating,
        title,
        comment,
        status: "published", 
        createdAt: serverTimestamp(),
      });

      toast({
        title: "Review Published!",
        description: "Your log has been synchronized with the community database.",
      });
      
      setTitle("");
      setComment("");
      setRating(5);
    } catch (error: any) {
      toast({ 
        title: "Sync Failed", 
        description: "Could not write to the database.", 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product);
    router.push('/checkout');
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-secondary/20 shadow-inner border border-secondary/20">
            <Image
              src={activeImage}
              alt={product.name}
              fill
              className={cn(
                "object-cover transition-all duration-500",
                selectedIndex === 1 && "rotate-90"
              )}
              priority
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
             {galleryImages.map((img, i) => (
                <button 
                  key={i} 
                  className={cn(
                    "aspect-square relative rounded-xl overflow-hidden bg-secondary/30 border-2 transition-all cursor-pointer",
                    selectedIndex === i ? "border-primary" : "border-transparent"
                  )}
                  onClick={() => setSelectedIndex(i)}
                >
                   <Image 
                    src={img} 
                    alt={`thumbnail ${i + 1}`} 
                    fill 
                    className={cn(
                      "object-cover transition-all",
                      i === 1 && "rotate-90",
                      selectedIndex === i ? "opacity-100 scale-110" : "opacity-60"
                    )} 
                   />
                </button>
             ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col relative overflow-hidden p-6 rounded-3xl">
          {/* Zebra Watermark - Faint Green 45 Degree Pattern (On/Off stripes) */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.03] z-0" 
            style={{ 
              backgroundImage: 'repeating-linear-gradient(45deg, hsl(var(--primary)) 0px, hsl(var(--primary)) 20px, transparent 20px, transparent 40px)',
            }}
          />
          
          {/* Custom Image Watermark: neolife logo.png - Faint Green on Left behind title */}
          <div className="absolute top-4 left-4 pointer-events-none opacity-[0.06] z-0">
            <Image
              src="/neolife logo.png"
              alt="NeoLife Background Logo"
              width={300}
              height={300}
              style={{ filter: 'sepia(1) hue-rotate(80deg) saturate(2) brightness(1.2)' }}
            />
          </div>
          
          {/* NeoLife Stamp Branding */}
          <div className="absolute top-10 right-0 pointer-events-none opacity-[0.05] z-0 -rotate-12 translate-x-1/4">
             <div className="flex flex-col items-center border-8 border-primary p-12 rounded-[4rem]">
                <span className="text-8xl font-black text-primary tracking-tighter">NEOLIFE</span>
             </div>
          </div>
          
          <div className="relative z-10">
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
                className="flex-grow gap-3 rounded-2xl h-16 text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
                onClick={() => addToCart(product)}
              >
                <ShoppingCart className="h-5 w-5" /> Add to Cart
              </Button>
              <Button 
                size="lg" 
                variant="secondary"
                className="flex-grow gap-3 rounded-2xl h-16 text-xs font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] hover:bg-accent hover:text-accent-foreground transition-all"
                onClick={handleBuyNow}
              >
                <ShoppingBag className="h-5 w-5" /> Buy Now
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className={cn("h-16 w-16 rounded-2xl flex-shrink-0 p-0 border-secondary transition-all", isInWishlist(product.id) && "text-red-500 bg-red-50")}
                onClick={() => toggleWishlist(product)}
              >
                <Heart className={cn("h-6 w-6", isInWishlist(product.id) && "fill-current")} />
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
      </div>

      <div className="mt-20">
        <Tabs defaultValue="reviews" className="w-full">
          <TabsList className="w-full justify-start bg-transparent border-b rounded-none h-14 p-0 gap-10">
            <TabsTrigger value="benefits" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent font-black uppercase text-[10px] tracking-[0.3em] h-full">Core Benefits</TabsTrigger>
            <TabsTrigger value="ingredients" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent font-black uppercase text-[10px] tracking-[0.3em] h-full">Composition</TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent font-black uppercase text-[10px] tracking-[0.3em] h-full flex items-center gap-2">
              Reviews <Badge className="bg-primary text-white border-none rounded-full h-5 min-w-[20px] px-1.5 flex items-center justify-center text-[9px] font-black">{dbReviews?.length || 0}</Badge>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="benefits" className="py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.benefits.map((benefit, i) => (
                <div key={i} className="flex items-start gap-4 p-6 bg-white border border-secondary/30 rounded-[2rem] shadow-sm">
                  <Star className="h-5 w-5 text-primary fill-current flex-shrink-0" />
                  <span className="text-lg font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="ingredients" className="py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {product.ingredients.map((ing, i) => (
                <div key={i} className="p-6 bg-secondary/30 rounded-[2rem] font-black uppercase text-[10px] tracking-widest text-center border border-white">
                  {ing}
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="py-12">
            <div className="space-y-12">
              {/* Review Submission - Flexible Wide Layout */}
              <Card className="border-none shadow-sm bg-white rounded-[2.5rem] overflow-hidden border border-secondary/10">
                <CardHeader className="p-8 pb-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <CardTitle className="text-2xl font-black tracking-tighter text-primary">Community Feedback</CardTitle>
                      <CardDescription className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Register Experience Node</CardDescription>
                    </div>
                    {user && (
                      <div className="flex items-center gap-2 p-2 bg-secondary/20 rounded-xl">
                         <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 mr-2">Intensity:</span>
                         {[1, 2, 3, 4, 5].map((star) => (
                            <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none transition-all hover:scale-125">
                              <Star className={cn("h-5 w-5", star <= rating ? "text-accent fill-current" : "text-slate-200")} />
                            </button>
                         ))}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-8 pt-4">
                  {user ? (
                    <form onSubmit={handleSubmitReview} className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
                      <div className="lg:col-span-3">
                        <Label htmlFor="rev-title" className="font-black uppercase text-[10px] tracking-widest text-slate-500 mb-2 block">Headline</Label>
                        <Input 
                          id="rev-title" 
                          placeholder="Summary" 
                          value={title} 
                          onChange={(e) => setTitle(e.target.value)} 
                          className="h-12 rounded-xl bg-secondary/40 border-none font-bold px-5" 
                        />
                      </div>
                      <div className="lg:col-span-7">
                        <Label htmlFor="rev-comment" className="font-black uppercase text-[10px] tracking-widest text-slate-500 mb-2 block">Observation Log</Label>
                        <Input 
                          id="rev-comment" 
                          placeholder="share your experience here" 
                          className="h-12 bg-secondary/40 border-none rounded-xl px-5 font-bold" 
                          value={comment} 
                          onChange={(e) => setComment(e.target.value)} 
                        />
                      </div>
                      <div className="lg:col-span-2">
                        <Button type="submit" className="w-full h-12 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-primary/20" disabled={isSubmitting}>
                          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                          Review
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-4 bg-secondary/10 rounded-2xl px-8 border border-dashed border-secondary">
                      <div className="flex items-center gap-4">
                        <Lock className="h-6 w-6 text-primary opacity-40" />
                        <p className="text-sm font-bold text-slate-600">Secure session required to broadcast experience.</p>
                      </div>
                      <Button asChild className="rounded-xl h-11 font-black uppercase tracking-widest text-[10px] px-8">
                        <Link href="/account">Initialize Session</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Reviews Display Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviewsLoading ? (
                  <div className="col-span-full flex flex-col items-center justify-center gap-4 py-20 text-primary">
                    <Activity className="h-10 w-10 animate-spin" />
                    <p className="font-black uppercase tracking-[0.4em] text-[10px]">Accessing Database...</p>
                  </div>
                ) : dbReviews && dbReviews.length > 0 ? (
                  dbReviews.map((review: any) => (
                    <Card key={review.id} className="border-none shadow-sm bg-white rounded-[2rem] p-6 border border-secondary/20 group hover:shadow-md transition-all flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary">
                              {review.userName?.charAt(0)}
                            </div>
                            <div>
                              <p className="text-xs font-black text-slate-800">{review.userName}</p>
                              <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">
                                {review.createdAt ? new Date(review.createdAt?.seconds * 1000).toLocaleDateString() : 'Just now'}
                              </p>
                            </div>
                          </div>
                          <div className="flex text-accent">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <Star key={idx} className={cn("h-3 w-3", idx < review.rating ? "fill-current" : "text-muted")} />
                            ))}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-black text-sm tracking-tight group-hover:text-primary transition-colors">{review.title}</h4>
                          <p className="text-xs text-muted-foreground leading-relaxed italic line-clamp-3">"{review.comment}"</p>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                   <div className="col-span-full py-20 text-center">
                     <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-xs">No experience logs found for this asset.</p>
                   </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
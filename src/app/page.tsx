"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Leaf, HeartPulse, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products, categories } from "@/lib/store";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function Home() {
  const featuredProducts = products.filter((p) => p.featured).slice(0, 7);
  const heroImage = PlaceHolderImages.find(img => img.id === "hero-main");

  const testimonials = [
    {
      name: "Jane Wambui",
      location: "Nairobi",
      text: "I've been using the Pro Vitality Pack for three months now, and my energy levels have never been higher. Wonderful Food Supplements provides genuine NeoLife products with excellent service."
    },
    {
      name: "Grace Wanjiku",
      location: "Embu",
      text: "I've tried many brands, but NeoLife is by far the most effective. The quality is evident from the first week of use. My whole family now uses it."
    },
    {
      name: "Peter Maina",
      location: "Mombasa",
      text: "Fast delivery and authentic products. I was skeptical about ordering supplements online in Kenya, but this store is professional and reliable. The Salmon Oil Plus is a game changer."
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage?.imageUrl || "https://picsum.photos/seed/banyan/1200/600"}
            alt="Wonderful Food Supplements"
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage?.imageHint || "banyan tree"}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight text-primary">
              Wonderful Food <br /> Supplements
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg">
              Empowering your wellness journey with premium NeoLife nutritional
              solutions. Quality supplements for a vibrant, healthy lifestyle in Kenya and across Africa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="rounded-full px-8 text-lg font-semibold"
                asChild
              >
                <Link href="/products">See All Products</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 text-lg font-semibold"
                asChild
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex items-center justify-center gap-3">
              <ShieldCheck className="h-8 w-8 text-accent" />
              <div className="text-sm font-medium">Certified Quality</div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Leaf className="h-8 w-8 text-accent" />
              <div className="text-sm font-medium">Natural Ingredients</div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <HeartPulse className="h-8 w-8 text-accent" />
              <div className="text-sm font-medium">Scientifically Proven</div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Sparkles className="h-8 w-8 text-accent" />
              <div className="text-sm font-medium">Premium Results</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories Carousel */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Explore Categories</h2>
              <p className="text-muted-foreground">
                Find the right support for your wellness goals
              </p>
            </div>
            <Link
              href="/products"
              className="text-primary font-semibold flex items-center gap-1 hover:underline"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="relative px-4 sm:px-12">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[
                Autoplay({
                  delay: 3000,
                }),
              ]}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {categories.map((category) => (
                  <CarouselItem
                    key={category.id}
                    className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                  >
                    <Link
                      href={`/products?cat=${category.id}`}
                      className="group relative overflow-hidden rounded-2xl aspect-[4/5] block"
                    >
                      <Image
                        src={category.imageUrl}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        data-ai-hint="category image"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6 text-white">
                        <h3 className="text-xl font-bold mb-1">
                          {category.name}
                        </h3>
                        <p className="text-sm opacity-80 line-clamp-1">
                          {category.description}
                        </p>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute -left-2 sm:-left-6 top-1/2 -translate-y-1/2" />
              <CarouselNext className="absolute -right-2 sm:-right-6 top-1/2 -translate-y-1/2" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Best Selling products - Grid of 7 with Text Areas */}
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Best Selling products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our most popular nutritional solutions, loved by customers across
              Kenya for their effectiveness and quality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-primary/5 flex flex-col group transition-all hover:shadow-md"
              >
                <div className="relative aspect-square bg-secondary/10">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {product.featured && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                        Best Seller
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold mb-3 text-primary group-hover:text-accent transition-colors">
                    {product.name}
                  </h3>
                  <div className="bg-secondary/20 p-5 rounded-2xl flex-grow mb-6 border border-secondary">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                        Price
                      </span>
                      <span className="font-bold text-xl text-primary">
                        KES {product.price.toLocaleString()}
                      </span>
                    </div>
                    <Button
                      className="rounded-full px-6 h-12 font-bold shadow-sm hover:shadow-md"
                      asChild
                    >
                      <Link href={`/products/${product.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button
              size="lg"
              className="rounded-full px-12 h-14 text-lg font-bold"
              asChild
            >
              <Link href="/products">See All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className="bg-background p-8 rounded-2xl border shadow-sm italic"
              >
                <p className="mb-6 text-muted-foreground">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-accent/30 flex items-center justify-center text-accent-foreground font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Verified Customer, {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto bg-white p-10 rounded-3xl shadow-xl border border-primary/10">
            <h2 className="text-3xl font-bold mb-4">
              Join Our Wellness Community
            </h2>
            <p className="text-muted-foreground mb-8">
              Subscribe for health tips, exclusive NeoLife product updates, and
              special offers delivered to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-8">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow h-12 px-6 rounded-full border border-input focus:ring-2 focus:ring-primary outline-none transition-all"
                required
              />
              <Button type="submit" className="h-12 px-8 rounded-full font-bold">
                Subscribe
              </Button>
            </form>

            <div className="relative w-full aspect-[2/1] rounded-2xl overflow-hidden mt-6">
              <Image
                src="/community image1.webp"
                alt="Community Wellness"
                fill
                className="object-contain"
                data-ai-hint="healthy community"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

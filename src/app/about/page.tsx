
"use client";

import Image from "next/image";
import { ShieldCheck, Leaf, HeartPulse, Users, Target, History } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  const values = [
    {
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      title: "Quality First",
      description: "We provide only 100% genuine NeoLife products, backed by the Scientific Advisory Board."
    },
    {
      icon: <Leaf className="h-8 w-8 text-primary" />,
      title: "Nature-Based",
      description: "Our supplements are derived from whole food sources to ensure maximum bio-availability."
    },
    {
      icon: <HeartPulse className="h-8 w-8 text-primary" />,
      title: "Proven Results",
      description: "Decades of scientific research go into every product we offer to our customers."
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="https://picsum.photos/seed/nature-abstract/1200/600"
            alt="Nature Background"
            fill
            className="object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Our Journey to Wellness</h1>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            Wonderful Food Supplements is dedicated to empowering lives through superior nutrition and health education across Kenya and Africa.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://picsum.photos/seed/health-mission/800/600"
                alt="Our Mission"
                fill
                className="object-cover"
                data-ai-hint="health mission"
              />
            </div>
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4">
                  <Target className="h-4 w-4" />
                  Our Mission
                </div>
                <h2 className="text-3xl font-bold mb-4 text-primary">Empowering Healthy Living</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Our mission is to provide high-quality, scientifically proven nutritional solutions that help people achieve optimal health. We believe that everyone deserves to live a vibrant, energetic life, free from the constraints of poor nutrition.
                </p>
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-accent-foreground text-sm font-bold mb-4">
                  <History className="h-4 w-4" />
                  Our Legacy
                </div>
                <h2 className="text-3xl font-bold mb-4 text-primary">The NeoLife Partnership</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  As proud distributors of NeoLife International, we bring over 60 years of nutritional expertise to your doorstep. NeoLife has been a pioneer in the industry since 1958, leading the way in whole-food supplementation and cellular nutrition.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What We Stand For</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our core values guide every decision we make and every product we recommend to our community.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
                <CardContent className="pt-8 text-center">
                  <div className="h-16 w-16 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <Users className="h-12 w-12 text-accent mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-primary">Building a Healthier Africa</h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12">
              Based in the heart of Nairobi, Kenya, Wonderful Food Supplements is more than just a store. We are a community of wellness enthusiasts, health practitioners, and individuals committed to making Africa a healthier continent, one supplement at a time.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="text-4xl font-extrabold text-primary mb-2">5k+</div>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Happy Customers</p>
              </div>
              <div>
                <div className="text-4xl font-extrabold text-primary mb-2">50+</div>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Products</p>
              </div>
              <div>
                <div className="text-4xl font-extrabold text-primary mb-2">10+</div>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Years Experience</p>
              </div>
              <div>
                <div className="text-4xl font-extrabold text-primary mb-2">24/7</div>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Expert Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

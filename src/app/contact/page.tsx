"use client";

import { Mail, Phone, MapPin, MessageSquare, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const { toast } = useToast();
  const phoneNumber = "+254 712 009290";
  const waLink = `https://wa.me/${phoneNumber.replace(/\s+/g, '').replace('+', '')}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "We've received your inquiry and will get back to you shortly.",
    });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-primary">Get in Touch</h1>
        <p className="text-lg text-muted-foreground">
          Have questions about our NeoLife products or need health advice? 
          Our team is here to support your wellness journey.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {/* Contact Info Cards */}
        <Card className="border-none shadow-md bg-white">
          <CardContent className="pt-8 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
              <Phone className="h-6 w-6" />
            </div>
            <CardTitle className="mb-2">Call Us</CardTitle>
            <p className="text-muted-foreground mb-4">Monday - Saturday, 8am - 6pm</p>
            <a href={`tel:${phoneNumber}`} className="text-lg font-bold text-primary hover:underline">
              {phoneNumber}
            </a>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white">
          <CardContent className="pt-8 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
              <Mail className="h-6 w-6" />
            </div>
            <CardTitle className="mb-2">Email Us</CardTitle>
            <p className="text-muted-foreground mb-4">We respond within 24 hours</p>
            <a href="mailto:info@wonderfulfood.co.ke" className="text-lg font-bold text-primary hover:underline">
              info@wonderfulfood.co.ke
            </a>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white">
          <CardContent className="pt-8 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
              <MapPin className="h-6 w-6" />
            </div>
            <CardTitle className="mb-2">Visit Us</CardTitle>
            <p className="text-muted-foreground mb-1">CBD, Nairobi, Kenya</p>
            <p className="text-sm font-semibold text-primary">P.O. Box 1115 - 30200</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Contact Form */}
        <Card className="shadow-lg border-none">
          <CardHeader>
            <CardTitle className="text-2xl">Send us a Message</CardTitle>
            <CardDescription>Fill out the form below and we'll reach out to you as soon as possible.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input id="first-name" placeholder="Jane" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input id="last-name" placeholder="Doe" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="jane@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="Product Inquiry" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="How can we help you today?" className="min-h-[150px]" required />
              </div>
              <Button type="submit" className="w-full h-12 text-lg font-bold gap-2">
                <Send className="h-5 w-5" />
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Clock className="h-6 w-6 text-primary" />
              Business Hours
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between border-b py-2">
                <span className="font-medium">Monday - Friday</span>
                <span className="text-muted-foreground">8:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between border-b py-2">
                <span className="font-medium">Saturday</span>
                <span className="text-muted-foreground">9:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-medium">Sunday & Holidays</span>
                <span className="text-accent font-bold">Closed</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-primary" />
              Quick Support
            </h2>
            <p className="text-muted-foreground mb-6">
              For urgent inquiries or orders, you can reach us instantly via WhatsApp. 
              We are ready to assist you with personalized supplement recommendations.
            </p>
            <Button size="lg" className="bg-[#25D366] hover:bg-[#1fb355] text-white w-full h-14 text-lg font-bold rounded-full gap-2" asChild>
              <a href={waLink} target="_blank" rel="noopener noreferrer">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.438 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat with an Expert
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart-context";
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Loader2, CheckCircle2, CreditCard, Smartphone, ArrowLeft, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import Image from "next/image";

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [phone, setPhone] = useState("");
  
  const shippingFee = 350; // Flat fee for demo
  const finalTotal = cartTotal + shippingFee;

  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/account");
    }
  }, [user, userLoading, router]);

  if (userLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const handlePayment = async (method: string) => {
    if (method !== 'card' && !phone) {
      toast({
        title: "Phone Required",
        description: "Please enter your mobile money phone number.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    // Simulate payment gateway delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsProcessing(false);
    setIsSuccess(true);
    clearCart();
    
    toast({
      title: "Order Successful!",
      description: `Your payment via ${method.toUpperCase()} has been processed.`,
    });
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto space-y-6">
          <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
            <CheckCircle2 className="h-16 w-16" />
          </div>
          <h1 className="text-4xl font-bold">Thank You!</h1>
          <p className="text-muted-foreground text-lg">
            Your order has been received and is being prepared for delivery. A confirmation email has been sent to {user.email}.
          </p>
          <div className="pt-8">
            <Button size="lg" className="rounded-full px-10" asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="flex items-center gap-4 mb-10">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/cart"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <h1 className="text-3xl font-bold">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Side: Payment & Info */}
        <div className="space-y-8">
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-secondary/30">
              <CardTitle className="text-xl">Payment Method</CardTitle>
              <CardDescription>Select your preferred way to pay securely.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Tabs defaultValue="mpesa" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8 h-12 rounded-xl">
                  <TabsTrigger value="mpesa" className="rounded-lg">M-Pesa</TabsTrigger>
                  <TabsTrigger value="airtel" className="rounded-lg">Airtel</TabsTrigger>
                  <TabsTrigger value="card" className="rounded-lg">Card</TabsTrigger>
                </TabsList>

                <TabsContent value="mpesa" className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-green-50 rounded-2xl border border-green-100">
                    <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <Smartphone className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-bold text-green-800">M-Pesa Express</p>
                      <p className="text-xs text-green-600">A prompt will be sent to your phone</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mpesa-phone">Phone Number (M-Pesa)</Label>
                    <Input 
                      id="mpesa-phone" 
                      placeholder="e.g. 0712345678" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <Button 
                    className="w-full h-14 rounded-xl bg-green-600 hover:bg-green-700 text-lg font-bold"
                    onClick={() => handlePayment('mpesa')}
                    disabled={isProcessing}
                  >
                    {isProcessing ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                    Pay KES {finalTotal.toLocaleString()}
                  </Button>
                </TabsContent>

                <TabsContent value="airtel" className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-red-50 rounded-2xl border border-red-100">
                    <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <Smartphone className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <p className="font-bold text-red-800">Airtel Money Express</p>
                      <p className="text-xs text-red-600">Secure mobile money payment</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="airtel-phone">Phone Number (Airtel)</Label>
                    <Input 
                      id="airtel-phone" 
                      placeholder="e.g. 0733123456" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <Button 
                    className="w-full h-14 rounded-xl bg-red-600 hover:bg-red-700 text-lg font-bold"
                    onClick={() => handlePayment('airtel')}
                    disabled={isProcessing}
                  >
                    {isProcessing ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                    Pay KES {finalTotal.toLocaleString()}
                  </Button>
                </TabsContent>

                <TabsContent value="card" className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="card-name">Name on Card</Label>
                      <Input id="card-name" placeholder="John Doe" className="h-12 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="card-number">Card Number</Label>
                      <div className="relative">
                        <Input id="card-number" placeholder="4000 0000 0000 0000" className="h-12 rounded-xl pl-12" />
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="card-expiry">Expiry Date</Label>
                        <Input id="card-expiry" placeholder="MM/YY" className="h-12 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="card-cvv">CVV</Label>
                        <Input id="card-cvv" placeholder="123" className="h-12 rounded-xl" />
                      </div>
                    </div>
                  </div>
                  <Button 
                    className="w-full h-14 rounded-xl bg-primary text-lg font-bold"
                    onClick={() => handlePayment('card')}
                    disabled={isProcessing}
                  >
                    {isProcessing ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                    Pay KES {finalTotal.toLocaleString()}
                  </Button>
                </TabsContent>
              </Tabs>
              <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                <ShieldCheck className="h-3 w-3" />
                SSL Encrypted & Secure
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Summary */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-secondary/30">
              <CardTitle className="text-xl">Order Review</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4 max-h-[300px] overflow-auto pr-2 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-secondary/20 flex-shrink-0">
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-sm line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-sm">KES {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              
              <Separator className="mb-6" />
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">KES {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping (Flat Rate)</span>
                  <span className="font-medium">KES {shippingFee.toLocaleString()}</span>
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between text-xl font-bold text-primary">
                  <span>Grand Total</span>
                  <span>KES {finalTotal.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-accent/10 border-accent/20 rounded-2xl">
            <CardContent className="p-4 flex gap-4 items-center">
              <div className="h-10 w-10 bg-accent rounded-full flex items-center justify-center text-accent-foreground">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <p className="text-xs font-medium leading-relaxed">
                Your health data and payment information are protected by industry-standard encryption.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

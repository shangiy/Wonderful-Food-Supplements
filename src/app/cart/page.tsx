"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/cart-context";
import { useUser } from "@/firebase";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  const { user } = useUser();

  if (cartCount === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto">
          <div className="h-24 w-24 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground">
            <ShoppingBag className="h-12 w-12" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">It looks like you haven't added anything to your cart yet. Browse our products to find the perfect supplements for you.</p>
          <Button size="lg" className="rounded-full px-8 font-bold" asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-10">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/products"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <h1 className="text-3xl font-bold">Your Shopping Cart</h1>
        <span className="text-muted-foreground">({cartCount} items)</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items Tabulation */}
        <div className="lg:col-span-2">
          <Card className="border-none shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-secondary/30">
                <TableRow>
                  <TableHead className="w-[400px]">Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Subtotal</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.map((item) => (
                  <TableRow key={item.id} className="hover:bg-transparent">
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-secondary/20 flex-shrink-0">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm leading-tight mb-1">{item.name}</h3>
                          <p className="text-xs text-muted-foreground capitalize mb-1">{item.category}</p>
                          <p className="font-bold text-primary text-sm">KES {item.price.toLocaleString()}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3 bg-secondary/30 w-fit rounded-full px-2 py-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 rounded-full hover:bg-white"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 rounded-full hover:bg-white"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold">
                      KES {(item.price * item.quantity).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card className="border-none shadow-lg bg-primary text-primary-foreground p-8 rounded-3xl">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="opacity-80">Subtotal ({cartCount} items)</span>
                <span>KES {cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-primary-foreground/20 pb-4">
                <span className="opacity-80">Shipping (Nairobi)</span>
                <span className="font-medium">Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-2">
                <span>Total</span>
                <span>KES {cartTotal.toLocaleString()}</span>
              </div>
            </div>
            
            {user ? (
              <Button size="lg" className="w-full h-14 mt-8 rounded-full bg-accent text-accent-foreground font-extrabold hover:bg-accent/90 gap-2">
                Proceed to Checkout
                <ArrowRight className="h-5 w-5" />
              </Button>
            ) : (
              <Button size="lg" className="w-full h-14 mt-8 rounded-full bg-secondary text-secondary-foreground font-extrabold gap-2" asChild>
                <Link href="/account">
                  <Lock className="h-5 w-5" />
                  Login to Checkout
                </Link>
              </Button>
            )}
            
            <p className="text-[10px] text-center mt-4 opacity-60">
              Safe and secure M-Pesa & Card payments integrated
            </p>
          </Card>
          
          <div className="bg-secondary/20 p-6 rounded-2xl border border-secondary">
            <h3 className="font-bold mb-2">Need Help?</h3>
            <p className="text-sm text-muted-foreground mb-4">Contact our wellness experts for assistance with your order.</p>
            <Button variant="outline" className="w-full rounded-full font-bold" asChild>
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
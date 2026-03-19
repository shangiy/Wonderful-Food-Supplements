
"use client";

import Link from "next/link";
import { ShoppingCart, User, Menu, Search, Heart, ShieldCheck, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { useUser, useFirestore, useDoc } from "@/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { doc } from "firebase/firestore";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user } = useUser();
  const db = useFirestore();

  const phoneNumber = "0712 009290";
  const waLink = "https://wa.me/254712009290";

  // Role check for dynamic UI
  const userDocRef = useMemo(() => {
    if (!db || !user) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);
  const { data: profile } = useDoc(userDocRef);

  const isAdmin = profile?.role === "admin";
  const isStaff = profile?.role === "staff";

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Catalog", href: "/products" },
    { name: "Our Mission", href: "/about" },
    { name: "Support", href: "/contact" },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Top Announcement Bar */}
      <div className="w-full bg-secondary/40 border-b py-2.5">
        <div className="container mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
          <div className="flex items-center gap-2">
            <span>Call us on:</span>
            <a href={`tel:${phoneNumber.replace(/\s+/g, '')}`} className="text-primary hover:underline">{phoneNumber}</a>
          </div>
          <div className="hidden md:block">Free delivery on all orders over Kes 30,000</div>
          <a 
            href={waLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-primary transition-colors text-primary font-bold"
          >
            Order on Whatsapp here
          </a>
        </div>
      </div>

      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-20 flex items-center">
        <div className="container mx-auto flex h-full items-center justify-between px-6">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-black text-primary tracking-tighter uppercase">Wonderful Food Supplements</span>
            </Link>
            <div className="hidden lg:flex gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-[10px] font-black uppercase tracking-[0.3em] transition-colors hover:text-primary text-slate-500"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Access Dashboard for Admin/Staff */}
            {(isAdmin || isStaff) && (
              <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10 transition-all h-12 w-12 rounded-2xl" asChild>
                <Link href="/admin" title="Vision Control">
                  <ShieldCheck className="h-6 w-6" />
                </Link>
              </Button>
            )}

            <div className="hidden xl:flex items-center relative mr-2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search assets..."
                className="w-[240px] pl-12 h-12 rounded-2xl bg-secondary/40 border-none text-[11px] font-bold"
              />
            </div>
            
            {/* Strict: Hide shopping modules for root Admins */}
            {!isAdmin && (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-slate-500 relative h-12 w-12 rounded-2xl hover:bg-secondary/50" asChild>
                  <Link href="/wishlist">
                    <Heart className="h-6 w-6" />
                    {wishlistCount > 0 && (
                      <span className="absolute top-1 right-1 bg-primary text-primary-foreground text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center border-2 border-background">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                </Button>

                <Button variant="ghost" size="icon" className="text-slate-500 relative h-12 w-12 rounded-2xl hover:bg-secondary/50" asChild>
                  <Link href="/cart">
                    <ShoppingCart className="h-6 w-6" />
                    {cartCount > 0 && (
                      <span className="absolute top-1 right-1 bg-accent text-accent-foreground text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center border-2 border-background">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </Button>
              </div>
            )}

            <div className="h-10 w-[1px] bg-secondary/50 mx-2 hidden sm:block" />

            <Button variant="ghost" size="icon" className="h-12 w-12 p-0 overflow-hidden rounded-2xl border-2 border-transparent hover:border-primary/30 transition-all" asChild>
              <Link href="/account">
                {user ? (
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.photoURL || ""} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-black">
                      {user.displayName?.charAt(0) || user.email?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <User className="h-6 w-6 text-slate-500" />
                )}
              </Link>
            </Button>

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden h-12 w-12 rounded-2xl">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] rounded-l-[3rem] border-l-secondary/20 p-8">
                <SheetTitle className="text-left mb-10 font-black uppercase tracking-tighter text-2xl">Portal Access</SheetTitle>
                <div className="flex flex-col gap-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-2xl font-black tracking-tighter transition-colors hover:text-primary"
                    >
                      {link.name}
                    </Link>
                  ))}
                  
                  <div className="border-t border-secondary/30 pt-10 flex flex-col gap-6">
                    {(isAdmin || isStaff) && (
                      <Link 
                        href="/admin" 
                        className="flex items-center gap-4 text-xl font-black tracking-tighter text-primary group"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <ShieldCheck className="h-6 w-6 group-hover:scale-110 transition-transform" />
                        Vision Dashboard
                      </Link>
                    )}
                    {!isAdmin && (
                      <>
                        <Link 
                          href="/wishlist" 
                          className="flex items-center gap-4 text-xl font-black tracking-tighter group"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Heart className="h-6 w-6 text-slate-500 group-hover:scale-110 transition-transform" />
                          My Saves
                          {wishlistCount > 0 && (
                            <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full font-black">
                              {wishlistCount}
                            </span>
                          )}
                        </Link>
                        <Link 
                          href="/cart" 
                          className="flex items-center gap-4 text-xl font-black tracking-tighter group"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <ShoppingCart className="h-6 w-6 text-slate-500 group-hover:scale-110 transition-transform" />
                          My Cart
                          {cartCount > 0 && (
                            <span className="bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded-full font-black">
                              {cartCount}
                            </span>
                          )}
                        </Link>
                      </>
                    )}
                    <Link 
                      href="/account" 
                      className="flex items-center gap-4 text-xl font-black tracking-tighter group"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="h-6 w-6 text-slate-500 group-hover:scale-110 transition-transform" />
                      Account Node
                    </Link>
                  </div>

                  {!user && (
                    <div className="flex flex-col gap-3 mt-auto pb-10">
                       <Button variant="outline" className="w-full h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest border-secondary" asChild>
                          <Link href="/account">Sign In</Link>
                       </Button>
                       <Button className="w-full h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20" asChild>
                          <Link href="/account">Create Node</Link>
                       </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </div>
  );
}


"use client";

import Link from "next/link";
import { ShoppingCart, User, Menu, Search, Heart, ShieldCheck } from "lucide-react";
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

  // Role check
  const userDocRef = useMemo(() => {
    if (!db || !user) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);
  const { data: profile } = useDoc(userDocRef);

  const isAdmin = profile?.role === "admin";
  const isStaff = profile?.role === "staff";

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/products" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6 lg:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-black text-primary tracking-tighter uppercase">Wonderful Food</span>
          </Link>
          <div className="hidden md:flex gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-xs font-black uppercase tracking-widest transition-colors hover:text-primary"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Admin Dashboard Quick Access */}
          {(isAdmin || isStaff) && (
            <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10 transition-colors mr-2" asChild>
              <Link href="/admin" title="Vision Control">
                <ShieldCheck className="h-5 w-5" />
              </Link>
            </Button>
          )}

          <div className="hidden lg:flex items-center relative mr-4">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search assets..."
              className="w-[200px] pl-10 h-9 rounded-xl bg-secondary/50 border-none text-[11px] font-bold"
            />
          </div>
          
          {/* Hide shopping icons for root Admins */}
          {!isAdmin && (
            <>
              <Button variant="ghost" size="icon" className="text-muted-foreground relative" asChild>
                <Link href="/wishlist">
                  <Heart className="h-5 w-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              </Button>

              <Button variant="ghost" size="icon" className="text-muted-foreground relative" asChild>
                <Link href="/cart">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </Button>
            </>
          )}

          <Button variant="ghost" size="icon" className="text-muted-foreground h-10 w-10 p-0 overflow-hidden rounded-full border-2 border-transparent hover:border-primary/20 transition-all" asChild>
            <Link href="/account">
              {user ? (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.photoURL || ""} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-black">
                    {user.displayName?.charAt(0) || user.email?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <User className="h-5 w-5" />
              )}
            </Link>
          </Button>

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] rounded-l-3xl">
              <SheetTitle className="text-left mb-6 font-black uppercase tracking-tighter">Portal Menu</SheetTitle>
              <div className="flex flex-col gap-6 pt-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-black tracking-tighter transition-colors hover:text-primary"
                  >
                    {link.name}
                  </Link>
                ))}
                
                <div className="border-t pt-6 flex flex-col gap-4">
                  {(isAdmin || isStaff) && (
                    <Link 
                      href="/admin" 
                      className="flex items-center gap-3 text-lg font-black tracking-tighter text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <ShieldCheck className="h-5 w-5" />
                      Admin Panel
                    </Link>
                  )}
                  {!isAdmin && (
                    <>
                      <Link 
                        href="/wishlist" 
                        className="flex items-center gap-3 text-lg font-black tracking-tighter"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Heart className="h-5 w-5" />
                        My Wishlist
                        {wishlistCount > 0 && (
                          <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full font-black">
                            {wishlistCount}
                          </span>
                        )}
                      </Link>
                      <Link 
                        href="/cart" 
                        className="flex items-center gap-3 text-lg font-black tracking-tighter"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <ShoppingCart className="h-5 w-5" />
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
                    className="flex items-center gap-3 text-lg font-black tracking-tighter"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    My Account
                  </Link>
                </div>

                {!user && (
                  <div className="flex flex-col gap-2 mt-auto pb-10">
                     <Button variant="outline" className="w-full h-12 rounded-xl font-bold" asChild>
                        <Link href="/account">Sign In</Link>
                     </Button>
                     <Button className="w-full h-12 rounded-xl font-bold" asChild>
                        <Link href="/account">Create Account</Link>
                     </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

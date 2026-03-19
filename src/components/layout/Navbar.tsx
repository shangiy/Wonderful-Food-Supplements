
"use client";

import Link from "next/link";
import { ShoppingCart, User, Menu, Search, Heart, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useMemo, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { useUser, useFirestore, useDoc } from "@/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { doc } from "firebase/firestore";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user } = useUser();
  const db = useFirestore();

  const phoneNumber = "0712009290";
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

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      // Trigger the squeeze animation after scrolling past the banner
      setIsScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hydration safety: use default values on server and initial client pass
  if (!mounted) {
    return (
      <div className="w-full">
        <div className="w-full bg-secondary/40 border-b py-2.5">
          <div className="container mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <div className="flex items-center gap-2">
              <span>Call us on:</span>
              <a href={`tel:${phoneNumber}`} className="text-primary hover:underline">{phoneNumber}</a>
            </div>
            <div className="hidden md:block">Free delivery on all orders over Kes 30,000</div>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="text-primary font-bold">Order on Whatsapp here</a>
          </div>
        </div>
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center shadow-sm h-16 md:h-20">
          <div className="container mx-auto flex h-full items-center justify-between px-6">
            <div className="flex items-center gap-6 lg:gap-12">
              <Link href="/" className="flex items-center group">
                <div className="mr-3 transition-all duration-300 group-hover:scale-110">
                   <svg width="42" height="42" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="8" y="8" width="84" height="84" rx="24" stroke="url(#green-gradient)" strokeWidth="7"/>
                    <path d="M32 22H68V34H32V22Z" stroke="url(#green-gradient)" strokeWidth="6" strokeLinejoin="round"/>
                    <path d="M36 34V74C36 77.3137 38.6863 80 42 80H58C61.3137 80 64 77.3137 64 74V34" stroke="url(#green-gradient)" strokeWidth="6" strokeLinecap="round"/>
                    <rect x="52" y="48" width="12" height="22" rx="2" stroke="url(#green-gradient)" strokeWidth="4"/>
                    <defs>
                      <linearGradient id="green-gradient" x1="8" y1="8" x2="92" y2="92" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#16301A"/>
                        <stop offset="1" stopColor="#A3E635"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm md:text-xl font-black text-primary tracking-tighter uppercase leading-none">Wonderful Food</span>
                  <span className="text-sm md:text-xl font-black text-accent tracking-tighter uppercase leading-none">Supplements</span>
                </div>
              </Link>
            </div>
          </div>
        </nav>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Top Announcement Bar - This will scroll away naturally */}
      <div className="w-full bg-secondary/40 border-b py-2.5">
        <div className="container mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
          <div className="flex items-center gap-2">
            <span>Call us on:</span>
            <a href={`tel:${phoneNumber}`} className="text-primary hover:underline">{phoneNumber}</a>
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

      {/* Main Navigation - This is strictly sticky and animates height */}
      <nav 
        className={cn(
          "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center shadow-sm transition-all duration-500 ease-in-out overflow-hidden",
          isScrolled ? "h-10 md:h-10" : "h-16 md:h-20"
        )}
      >
        <div className="container mx-auto flex h-full items-center justify-between px-6">
          <div className="flex items-center gap-6 lg:gap-12">
            <Link href="/" className="flex items-center group">
              <div className={cn(
                "mr-3 transition-all duration-500 group-hover:scale-110 origin-left",
                isScrolled ? "scale-[0.6]" : "scale-100"
              )}>
                <svg width="42" height="42" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="8" y="8" width="84" height="84" rx="24" stroke="url(#green-gradient)" strokeWidth="7"/>
                  <path d="M32 22H68V34H32V22Z" stroke="url(#green-gradient)" strokeWidth="6" strokeLinejoin="round"/>
                  <path d="M36 34V74C36 77.3137 38.6863 80 42 80H58C61.3137 80 64 77.3137 64 74V34" stroke="url(#green-gradient)" strokeWidth="6" strokeLinecap="round"/>
                  <rect x="52" y="48" width="12" height="22" rx="2" stroke="url(#green-gradient)" strokeWidth="4"/>
                  <defs>
                    <linearGradient id="green-gradient" x1="8" y1="8" x2="92" y2="92" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#16301A"/>
                      <stop offset="1" stopColor="#A3E635"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className={cn(
                "flex flex-col transition-all duration-500 origin-left",
                isScrolled ? "scale-75 translate-y-1" : "scale-100"
              )}>
                <span className="text-sm md:text-xl font-black text-primary tracking-tighter uppercase leading-none">
                  Wonderful Food
                </span>
                <span className="text-sm md:text-xl font-black text-accent tracking-tighter uppercase leading-none">
                  Supplements
                </span>
              </div>
            </Link>
            <div className="hidden lg:flex gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "font-black uppercase tracking-[0.3em] transition-all hover:text-primary text-slate-500",
                    isScrolled ? "text-[8px]" : "text-[10px]"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {(isAdmin || isStaff) && (
              <Button variant="ghost" size="icon" className={cn("text-primary hover:bg-primary/10 transition-all rounded-2xl", isScrolled ? "h-7 w-7" : "h-12 w-12")} asChild>
                <Link href="/admin" title="Vision Control">
                  <ShieldCheck className={isScrolled ? "h-4 w-4" : "h-6 w-6"} />
                </Link>
              </Button>
            )}

            <div className={cn("hidden xl:flex items-center relative mr-2 transition-all duration-500", isScrolled ? "opacity-0 w-0 scale-90 translate-x-4 pointer-events-none" : "opacity-100")}>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search assets..."
                className="w-[240px] pl-12 h-12 rounded-2xl bg-secondary/40 border-none text-[11px] font-bold"
              />
            </div>
            
            {!isAdmin && (
              <div className="flex items-center gap-1 md:gap-2">
                <Button variant="ghost" size="icon" className={cn("text-slate-500 relative rounded-2xl hover:bg-secondary/50 transition-all", isScrolled ? "h-8 w-8" : "h-12 w-12")} asChild>
                  <Link href="/wishlist">
                    <Heart className={isScrolled ? "h-4 w-4" : "h-6 w-6"} />
                    {wishlistCount > 0 && (
                      <span className="absolute top-1 right-1 bg-primary text-primary-foreground text-[8px] font-black px-1 py-0.5 rounded-full min-w-[14px] h-[14px] flex items-center justify-center border-2 border-background">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                </Button>

                <Button variant="ghost" size="icon" className={cn("text-slate-500 relative rounded-2xl hover:bg-secondary/50 transition-all", isScrolled ? "h-8 w-8" : "h-12 w-12")} asChild>
                  <Link href="/cart">
                    <ShoppingCart className={isScrolled ? "h-4 w-4" : "h-6 w-6"} />
                    {cartCount > 0 && (
                      <span className="absolute top-1 right-1 bg-accent text-accent-foreground text-[8px] font-black px-1 py-0.5 rounded-full min-w-[14px] h-[14px] flex items-center justify-center border-2 border-background">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </Button>
              </div>
            )}

            <div className={cn("w-[1px] bg-secondary/50 mx-2 hidden sm:block transition-all duration-500", isScrolled ? "h-4" : "h-10")} />

            <Button variant="ghost" size="icon" className={cn("p-0 overflow-hidden rounded-2xl border-2 border-transparent hover:border-primary/30 transition-all duration-500", isScrolled ? "h-7 w-7" : "h-12 w-12")} asChild>
              <Link href="/account">
                {user ? (
                  <Avatar className={isScrolled ? "h-6 w-6" : "h-10 w-10"}>
                    <AvatarImage src={user.photoURL || ""} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-[8px] font-black">
                      {user.displayName?.charAt(0) || user.email?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <User className={isScrolled ? "h-4 w-4" : "h-6 w-6 text-slate-500"} />
                )}
              </Link>
            </Button>

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={cn("lg:hidden rounded-2xl transition-all", isScrolled ? "h-8 w-8" : "h-12 w-12")}>
                  <Menu className={isScrolled ? "h-4 w-4" : "h-6 w-6"} />
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
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </div>
  );
}

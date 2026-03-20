"use client";

import { useState, useMemo, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { products, categories, type Product } from "@/lib/store";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LayoutGrid, List, Filter, Search, X, Plus, ShoppingBag, Heart, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function FilterContent({ 
  selectedCategory, 
  setSelectedCategory, 
  priceRange, 
  setPriceRange,
  onItemClick
}: { 
  selectedCategory: string; 
  setSelectedCategory: (val: string) => void; 
  priceRange: number[]; 
  setPriceRange: (val: number[]) => void;
  onItemClick?: () => void;
}) {
  const handleCategorySelect = (id: string) => {
    setSelectedCategory(id);
    if (onItemClick) onItemClick();
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-black uppercase text-[10px] tracking-[0.2em] text-muted-foreground mb-4">Categories</h3>
        <div className="space-y-1.5">
          <button
            onClick={() => handleCategorySelect("all")}
            className={cn(
              "block w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-widest",
              selectedCategory === "all" ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-secondary text-slate-600"
            )}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={cn(
                "block w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-widest",
                selectedCategory === cat.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-secondary text-slate-600"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-black uppercase text-[10px] tracking-[0.2em] text-muted-foreground mb-4">Price Threshold (KES)</h3>
        <div className="px-2">
          <Slider
            defaultValue={[0, 10000]}
            max={10000}
            step={500}
            value={priceRange}
            onValueChange={setPriceRange}
            className="mb-6"
          />
          <div className="flex justify-between items-center bg-secondary/30 p-3 rounded-xl">
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-muted-foreground uppercase">Min</span>
              <span className="text-xs font-black">{priceRange[0].toLocaleString()}</span>
            </div>
            <div className="h-4 w-[1px] bg-secondary-foreground/10" />
            <div className="flex flex-col text-right">
              <span className="text-[8px] font-black text-muted-foreground uppercase">Max</span>
              <span className="text-xs font-black">{priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const catParam = searchParams.get("cat");
  
  const [selectedCategory, setSelectedCategory] = useState<string>(catParam || "all");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>("popularity");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const router = useRouter();

  const filteredProducts = useMemo(() => {
    let result = products.filter(product => {
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesPrice && matchesSearch;
    });

    return [...result].sort((a, b) => {
      if (sortBy === "popularity") {
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
      if (sortBy === "price-low") {
        return a.price - b.price;
      }
      if (sortBy === "price-high") {
        return b.price - a.price;
      }
      if (sortBy === "newest") {
        return parseInt(b.id) - parseInt(a.id);
      }
      return 0;
    });
  }, [selectedCategory, priceRange, searchQuery, sortBy]);

  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return products
      .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 5);
  }, [searchQuery]);

  const handleSuggestionClick = (name: string) => {
    setSearchQuery(name);
    setShowSuggestions(false);
  };

  const handleBuyNow = (product: Product) => {
    addToCart(product);
    router.push('/checkout');
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
      <aside className="hidden md:block w-64 flex-shrink-0 space-y-8">
        <div className="sticky top-28">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Filter className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-black tracking-tighter">Asset Filters</h2>
          </div>
          <FilterContent 
            selectedCategory={selectedCategory} 
            setSelectedCategory={setSelectedCategory} 
            priceRange={priceRange} 
            setPriceRange={setPriceRange} 
          />
        </div>
      </aside>

      <div className="flex-grow">
        <div className="relative mb-8 flex flex-row items-center gap-2 sm:gap-3">
          <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="secondary" className="md:hidden h-14 px-4 rounded-2xl gap-2 font-black uppercase text-[10px] tracking-widest bg-white border border-secondary shadow-sm flex-shrink-0">
                <SlidersHorizontal className="h-4 w-4" />
                Filter
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] rounded-r-[3rem] border-r-secondary/20 p-8">
              <SheetHeader className="mb-10 text-left">
                <SheetTitle className="text-2xl font-black tracking-tighter">Vision Filters</SheetTitle>
              </SheetHeader>
              <FilterContent 
                selectedCategory={selectedCategory} 
                setSelectedCategory={setSelectedCategory} 
                priceRange={priceRange} 
                setPriceRange={setPriceRange} 
                onItemClick={() => setIsMobileFiltersOpen(false)}
              />
            </SheetContent>
          </Sheet>

          <div className="relative flex-grow group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              type="text"
              placeholder="Search catalog..."
              className="pl-12 h-14 rounded-2xl border-none bg-secondary/40 focus-visible:ring-primary font-bold shadow-sm w-full"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-secondary rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white rounded-3xl border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-3">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      onClick={() => handleSuggestionClick(suggestion.name)}
                      className="flex items-center gap-4 w-full text-left px-5 py-3.5 hover:bg-secondary/50 rounded-2xl transition-all group"
                    >
                      <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <Search className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800">{suggestion.name}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{suggestion.category}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Button size="lg" className="h-14 px-4 sm:px-10 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-primary/20 flex-shrink-0">
            <Search className="h-5 w-5 sm:mr-2" />
            <span className="hidden sm:inline">Search Hub</span>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-10">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-black tracking-tighter text-slate-900">
              {selectedCategory === "all" 
                ? "Product Catalog" 
                : categories.find(c => c.id === selectedCategory)?.name}
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mt-1">
              {filteredProducts.length} Dynamic Assets Synchronized
            </p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-1.5 p-1.5 bg-secondary/30 rounded-2xl border border-secondary/10">
               <Button 
                variant="ghost" 
                size="icon" 
                className={cn("h-10 w-10 rounded-xl transition-all", viewMode === 'grid' ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-primary")}
                onClick={() => setViewMode('grid')}
               >
                 <LayoutGrid className="h-5 w-5" />
               </Button>
               <Button 
                variant="ghost" 
                size="icon" 
                className={cn("h-10 w-10 rounded-xl transition-all", viewMode === 'list' ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-primary")}
                onClick={() => setViewMode('list')}
               >
                 <List className="h-5 w-5 rotate-90" />
               </Button>
             </div>
             
             <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-12 border-none rounded-2xl px-6 text-[10px] font-black uppercase tracking-[0.2em] outline-none bg-secondary/30 shadow-sm cursor-pointer hover:bg-secondary/50 transition-colors"
             >
                <option value="popularity">Popularity</option>
                <option value="price-low">Low to High</option>
                <option value="price-high">High to Low</option>
                <option value="newest">Newest</option>
             </select>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-[2.5rem] p-6 flex flex-col sm:flex-row gap-8 border border-secondary/20 hover:shadow-2xl hover:border-primary/20 transition-all group relative overflow-hidden">
                  <div className="relative h-48 w-full sm:h-56 sm:w-56 rounded-[2rem] overflow-hidden bg-secondary/20 flex-shrink-0 shadow-inner">
                    <Image 
                      src={product.imageUrl} 
                      alt={product.name} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  </div>
                  <div className="flex-grow flex flex-col justify-between py-2 relative z-10">
                    <div>
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div>
                          <Badge className="text-[9px] font-black uppercase tracking-widest text-primary bg-primary/5 border-none mb-3 px-3 py-1">{product.category}</Badge>
                          <h3 className="text-2xl font-black tracking-tighter text-slate-900 group-hover:text-primary transition-colors">{product.name}</h3>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Asset Value</p>
                          <p className="text-2xl font-black text-slate-800 tracking-tighter">KES {product.price.toLocaleString()}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground font-medium line-clamp-2 max-w-2xl mt-4 leading-relaxed">{product.description}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 items-center mt-8">
                      <Button 
                        className="rounded-2xl h-14 px-8 font-black uppercase text-[10px] tracking-widest gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
                        onClick={() => addToCart(product)}
                      >
                        <Plus className="h-5 w-5" /> Add to Cart
                      </Button>
                      <Button 
                        variant="secondary" 
                        className="rounded-2xl h-14 px-8 font-black uppercase text-[10px] tracking-widest gap-3 bg-accent text-accent-foreground hover:scale-[1.02] transition-all shadow-lg"
                        onClick={() => handleBuyNow(product)}
                      >
                        <ShoppingBag className="h-5 w-5" /> Buy Now
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={cn("h-14 w-14 rounded-2xl border border-secondary transition-all", isInWishlist(product.id) && "text-red-500 bg-red-50 border-red-100")}
                        onClick={() => toggleWishlist(product)}
                      >
                        <Heart className={cn("h-6 w-6", isInWishlist(product.id) && "fill-current")} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-24 bg-white rounded-[3rem] border-4 border-dashed border-secondary/50 space-y-8">
            <div className="h-20 w-20 bg-secondary/20 rounded-[2rem] flex items-center justify-center mx-auto text-muted-foreground animate-pulse">
              <Search className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black tracking-tighter">Zero Assets Found</h3>
              <p className="text-muted-foreground text-sm font-medium">Your current vision criteria returned no matches from the database.</p>
            </div>
            <Button 
              variant="outline" 
              className="rounded-2xl px-10 h-14 font-black uppercase tracking-widest text-[10px] border-secondary"
              onClick={() => {
                setSelectedCategory("all"); 
                setPriceRange([0, 10000]);
                setSearchQuery("");
              }}
            >
              Reset Vision Parameters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-6 py-12 md:py-20">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
          <SlidersHorizontal className="h-12 w-12 text-primary animate-pulse" />
          <p className="font-black uppercase tracking-[0.4em] text-[10px] text-muted-foreground">Initializing Vision Catalog...</p>
        </div>
      }>
        <ProductsContent />
      </Suspense>
    </div>
  );
}
"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { products, categories } from "@/lib/store";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { LayoutGrid, List, Filter } from "lucide-react";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const catParam = searchParams.get("cat");
  
  const [selectedCategory, setSelectedCategory] = useState<string>(catParam || "all");
  const [priceRange, setPriceRange] = useState([0, 10000]);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesCategory && matchesPrice;
  });

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-4 font-bold text-lg">
              <Filter className="h-5 w-5 text-primary" />
              <span>Filters</span>
            </div>
            <Separator className="mb-6" />
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Categories</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`block w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                      selectedCategory === "all" ? "bg-primary text-white font-medium" : "hover:bg-secondary"
                    }`}
                  >
                    All Products
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`block w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                        selectedCategory === cat.id ? "bg-primary text-white font-medium" : "hover:bg-secondary text-muted-foreground"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Price Range (KES)</h3>
                <Slider
                  defaultValue={[0, 10000]}
                  max={10000}
                  step={500}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mb-4"
                />
                <div className="flex justify-between text-xs font-medium text-muted-foreground">
                  <span>KES {priceRange[0]}</span>
                  <span>KES {priceRange[1]}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-grow">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
            <h1 className="text-2xl font-bold">
              {selectedCategory === "all" 
                ? "All Products" 
                : categories.find(c => c.id === selectedCategory)?.name}
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({filteredProducts.length} items)
              </span>
            </h1>
            
            <div className="flex items-center gap-2">
               <span className="text-xs text-muted-foreground hidden sm:block">View:</span>
               <Button variant="ghost" size="icon" className="h-8 w-8"><LayoutGrid className="h-4 w-4" /></Button>
               <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><List className="h-4 w-4" /></Button>
               <select className="text-xs h-8 border rounded px-2 outline-none ml-2">
                  <option>Sort by: Popularity</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest Arrivals</option>
               </select>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-secondary/10 rounded-3xl border border-dashed">
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your filters or search criteria.</p>
              <Button onClick={() => {setSelectedCategory("all"); setPriceRange([0, 10000]);}}>Reset Filters</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
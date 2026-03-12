"use client";

import { useState } from "react";
import { generateProductDescription } from "@/ai/flows/generate-product-description-flow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, Loader2, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function NewProductPage() {
  const { toast } = useToast();
  const [productName, setProductName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [description, setDescription] = useState("");
  const [benefits, setBenefits] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateContent = async () => {
    if (!productName || !ingredients) {
      toast({
        title: "Missing Information",
        description: "Please enter product name and key ingredients first.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const ingredientList = ingredients.split(",").map(i => i.trim());
      const result = await generateProductDescription({
        productName,
        ingredients: ingredientList,
      });
      
      setDescription(result.description);
      setBenefits(result.healthBenefits);
      
      toast({
        title: "AI Generation Success",
        description: "Compelling description and benefits created!",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "An error occurred while generating content.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <p className="text-muted-foreground">Fill in details or use AI to generate content</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin">Cancel</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Start with the product name and core ingredients</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input 
                  id="name" 
                  placeholder="e.g. NeoLife Tre-en-en" 
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (KES)</Label>
                <Input id="price" type="number" placeholder="3450" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ingredients">Ingredients (comma separated)</Label>
              <Input 
                id="ingredients" 
                placeholder="Wheat germ, rice bran, soy oil..." 
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
              />
            </div>

            <Button 
              type="button" 
              variant="secondary" 
              className="w-full gap-2 border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary"
              onClick={handleGenerateContent}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating Content...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  AI Enhance Content
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {(description || benefits.length > 0) && (
          <Card className="border-accent/40 bg-accent/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                AI Generated Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Generated Description</Label>
                <Textarea 
                  className="min-h-[150px] bg-white" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Health Benefits</Label>
                <div className="space-y-2">
                  {benefits.map((benefit, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Input 
                        value={benefit} 
                        className="bg-white"
                        onChange={(e) => {
                          const newBenefits = [...benefits];
                          newBenefits[idx] = e.target.value;
                          setBenefits(newBenefits);
                        }}
                      />
                      <Button variant="ghost" size="icon" onClick={() => setBenefits(benefits.filter((_, i) => i !== idx))}>
                        <X className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => setBenefits([...benefits, ""])}>Add Benefit</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end gap-4">
          <Button variant="outline">Save as Draft</Button>
          <Button className="gap-2">
            <Save className="h-4 w-4" />
            Publish Product
          </Button>
        </div>
      </div>
    </div>
  );
}
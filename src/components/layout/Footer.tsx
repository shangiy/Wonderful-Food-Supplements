import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-primary mb-4 font-headline">Wonderful Food Supplements</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Promoting healthy living through quality NeoLife nutritional supplements in Kenya and across Africa.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/products" className="hover:text-primary transition-colors">Shop All Products</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About Our Mission</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Health Tips & Blog</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">Frequently Asked Questions</Link></li>
              <li><Link href="/delivery" className="hover:text-primary transition-colors">Delivery & Returns</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/products?cat=vitamins" className="hover:text-primary transition-colors">Vitamins & Minerals</Link></li>
              <li><Link href="/products?cat=fitness" className="hover:text-primary transition-colors">Fitness & Protein</Link></li>
              <li><Link href="/products?cat=weight" className="hover:text-primary transition-colors">Weight Management</Link></li>
              <li><Link href="/products?cat=immune" className="hover:text-primary transition-colors">Immune Support</Link></li>
              <li><Link href="/products?cat=beauty" className="hover:text-primary transition-colors">Beauty & Skin</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Contact Info</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <span>CBD, Nairobi, Kenya</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <span>+254 700 000000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <span>info@wonderfulfood.co.ke</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Wonderful Food Supplements. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
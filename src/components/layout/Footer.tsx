import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Github } from "lucide-react";

export function Footer() {
  const phoneNumber = "0712 009290";
  const waLink = "https://wa.me/254712009290";

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
              <Link href="https://github.com/shangiy/Wonderful-Food-Supplements" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </Link>
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
              <li><Link href="/faq" className="hover:text-primary transition-colors">Frequently Asked Questions</Link></li>
              <li><Link href="/delivery" className="hover:text-primary transition-colors">Delivery & Returns</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/products?cat=vitamins" className="hover:text-primary transition-colors">Vitamins & Minerals</Link></li>
              <li><Link href="/products?cat=protein" className="hover:text-primary transition-colors">Protein Supplements</Link></li>
              <li><Link href="/products?cat=fitness" className="hover:text-primary transition-colors">Fitness & Energy</Link></li>
              <li><Link href="/products?cat=weight" className="hover:text-primary transition-colors">Weight Management</Link></li>
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
                <a href={`tel:${phoneNumber.replace(/\s+/g, '')}`} className="hover:text-primary transition-colors">{phoneNumber}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <span>info@wonderfulfood.co.ke</span>
              </li>
              <li className="pt-2">
                <a 
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-full text-xs font-bold hover:opacity-90 transition-opacity"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.438 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Chat with Us
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Wonderful Food Supplements. All rights reserved.</p>
          <p className="mt-2 text-xs opacity-70">Developed by mushangi coder+</p>
        </div>
      </div>
    </footer>
  );
}

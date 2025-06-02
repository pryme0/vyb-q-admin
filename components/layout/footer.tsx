import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Saveur</h3>
            <p className="text-muted-foreground">
              Elevating dining with exceptional cuisine and a sophisticated atmosphere.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Navigation</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
              <li><Link href="/menu" className="hover:text-foreground transition-colors">Menu</Link></li>
              <li><Link href="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Information</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/reservations" className="hover:text-foreground transition-colors">Reservations</Link></li>
              <li><Link href="/private-events" className="hover:text-foreground transition-colors">Private Events</Link></li>
              <li><Link href="/gift-cards" className="hover:text-foreground transition-colors">Gift Cards</Link></li>
              <li><Link href="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Contact Us</h4>
            <address className="not-italic text-muted-foreground space-y-2">
              <p>123 Gourmet Street</p>
              <p>Culinary District, FD 12345</p>
              <p className="mt-4">(555) 123-4567</p>
              <p>info@saveur.com</p>
            </address>
          </div>
        </div>
        
        <Separator className="my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Saveur Restaurant. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm">
            <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/accessibility" className="text-muted-foreground hover:text-foreground transition-colors">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
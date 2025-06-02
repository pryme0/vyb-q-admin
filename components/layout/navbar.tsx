"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useEffect, useState } from "react";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { ModeToggle } from "./mode-toggle";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { itemCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <>
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled 
            ? "bg-background/80 backdrop-blur-md shadow-sm py-3" 
            : "bg-transparent py-5"
        )}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="font-semibold text-xl">Saveur</Link>

          {/* Mobile menu button */}
          <button 
            onClick={toggleMenu}
            className="md:hidden text-foreground"
            aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-foreground/90 hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/menu" 
              className="text-foreground/90 hover:text-foreground transition-colors"
            >
              Menu
            </Link>
            <Link 
              href="/about" 
              className="text-foreground/90 hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="text-foreground/90 hover:text-foreground transition-colors"
            >
              Contact
            </Link>
          </nav>
          
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button 
              variant="outline" 
              size="icon" 
              className="relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                  {itemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>
      
      {/* Mobile menu */}
      <div className={cn(
        "fixed inset-0 z-40 bg-background transition-transform duration-300 transform md:hidden",
        isMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full pt-20 p-6">
          <nav className="flex flex-col space-y-6 text-lg">
            <Link 
              href="/" 
              className="text-foreground/90 hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/menu" 
              className="text-foreground/90 hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Menu
            </Link>
            <Link 
              href="/about" 
              className="text-foreground/90 hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="text-foreground/90 hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
      
      <CartDrawer open={isCartOpen} onOpenChange={setIsCartOpen} />
    </>
  );
}
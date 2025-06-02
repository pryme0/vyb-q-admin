"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { getItemById } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MinusIcon, PlusIcon, InfoIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/cart-context";
import { MenuList } from "@/components/menu/menu-list";
import { getItemsByCategory } from "@/lib/actions";
import { motion } from "framer-motion";

export default function MenuItemPage() {
  const router = useRouter();
  const params = useParams();
  const { addToCart } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  
  const id = params.id as string;
  const menuItem = getItemById(id);

  // If item doesn't exist, show error
  if (!menuItem) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <InfoIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-4">Item Not Found</h1>
        <p className="text-muted-foreground mb-8">The menu item you're looking for doesn't exist or may have been removed.</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    setAddingToCart(true);
    addToCart(menuItem, quantity);
    
    // Reset after animation
    setTimeout(() => {
      setAddingToCart(false);
    }, 1000);
  };

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const relatedItems = getItemsByCategory(menuItem.category)
    .filter(item => item.id !== menuItem.id)
    .slice(0, 3);

  // Format dietary restrictions for display
  const dietaryBadges = menuItem.dietary?.map(diet => {
    const badgeType = {
      'vegetarian': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'vegan': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
      'gluten-free': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
      'dairy-free': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'nut-free': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    }[diet] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    
    return (
      <Badge 
        key={diet} 
        variant="outline" 
        className={`${badgeType}`}
      >
        {diet.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
      </Badge>
    );
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        className="mb-8 pl-0 hover:pl-0"
        onClick={() => router.back()}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Menu
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="relative aspect-square overflow-hidden rounded-xl">
          <Image 
            src={menuItem.image} 
            alt={menuItem.name} 
            fill
            priority
            className="object-cover"
          />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col"
        >
          {menuItem.featured && (
            <Badge className="self-start mb-2 bg-primary/80">
              Chef's Choice
            </Badge>
          )}
          
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{menuItem.name}</h1>
          <p className="text-2xl font-medium mb-4">${menuItem.price.toFixed(2)}</p>
          
          <p className="text-muted-foreground mb-6">
            {menuItem.description}
          </p>
          
          {menuItem.dietary && menuItem.dietary.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {dietaryBadges}
            </div>
          )}
          
          {menuItem.ingredients && (
            <div className="mb-6">
              <h3 className="text-md font-medium mb-2">Ingredients</h3>
              <p className="text-muted-foreground">
                {menuItem.ingredients.join(", ")}
              </p>
            </div>
          )}
          
          <Separator className="my-6" />
          
          <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center border rounded-md">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 rounded-none rounded-l-md"
                onClick={handleDecreaseQuantity}
                disabled={quantity === 1}
              >
                <MinusIcon className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 rounded-none rounded-r-md"
                onClick={handleIncreaseQuantity}
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
            
            <Button 
              size="lg" 
              className="flex-1 relative overflow-hidden"
              disabled={addingToCart}
              onClick={handleAddToCart}
            >
              <span className={`transition-all duration-300 ${addingToCart ? 'opacity-0' : 'opacity-100'}`}>
                Add to Cart - ${(menuItem.price * quantity).toFixed(2)}
              </span>
              <span 
                className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                  addingToCart ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
                }`}
              >
                Added!
              </span>
            </Button>
          </div>
        </motion.div>
      </div>
      
      {relatedItems.length > 0 && (
        <section className="mt-16 pt-8 border-t">
          <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
          <MenuList items={relatedItems} />
        </section>
      )}
    </div>
  );
}
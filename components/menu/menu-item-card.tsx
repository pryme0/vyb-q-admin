"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusIcon } from "lucide-react";
import { MenuItem } from "@/types";
import { useCart } from "@/context/cart-context";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MenuItemCardProps {
  item: MenuItem;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(item, 1);
  };

  const dietaryBadges = item.dietary?.map(diet => {
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
        className={`${badgeType} text-xs`}
      >
        {diet.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
      </Badge>
    );
  });

  return (
    <Link href={`/menu/${item.id}`}>
      <Card 
        className="overflow-hidden h-full transition-all duration-300 hover:shadow-md flex flex-col"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image 
            src={item.image} 
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={cn(
              "object-cover transition-transform duration-500", 
              isHovering && "scale-105"
            )}
          />
          {item.featured && (
            <Badge className="absolute top-2 right-2 bg-primary/80">
              Chef's Choice
            </Badge>
          )}
        </div>
        <CardContent className="flex-1 pt-4">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-semibold text-lg line-clamp-1">{item.name}</h3>
            <span className="font-semibold">${item.price.toFixed(2)}</span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {item.description}
          </p>
          {item.dietary && item.dietary.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {dietaryBadges}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full group"
            onClick={handleAddToCart}
          >
            <PlusIcon className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
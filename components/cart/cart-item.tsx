"use client";

import { CartItem } from "@/types";
import { useCart } from "@/context/cart-context";
import { MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CartItemProps {
  item: CartItem;
}

export function CartItemComponent({ item }: CartItemProps) {
  const { removeFromCart, updateQuantity } = useCart();
  const [isRemoving, setIsRemoving] = useState(false);
  
  const handleRemove = () => {
    setIsRemoving(true);
    // Slight delay for animation
    setTimeout(() => {
      removeFromCart(item.menuItem.id);
    }, 300);
  };

  const handleIncreaseQuantity = () => {
    updateQuantity(item.menuItem.id, item.quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (item.quantity > 1) {
      updateQuantity(item.menuItem.id, item.quantity - 1);
    } else {
      handleRemove();
    }
  };

  return (
    <div 
      className={cn(
        "flex gap-3 py-4 border-b border-border transition-all duration-300",
        isRemoving && "opacity-0 transform -translate-x-4"
      )}
    >
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
        <Image
          src={item.menuItem.image}
          alt={item.menuItem.name}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between text-base font-medium">
          <h3>{item.menuItem.name}</h3>
          <p className="ml-4">${(item.menuItem.price * item.quantity).toFixed(2)}</p>
        </div>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
          {item.menuItem.description}
        </p>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center border rounded-md">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-none rounded-l-md"
              onClick={handleDecreaseQuantity}
            >
              <MinusIcon className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm">{item.quantity}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-none rounded-r-md"
              onClick={handleIncreaseQuantity}
            >
              <PlusIcon className="h-3 w-3" />
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-destructive"
            onClick={handleRemove}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
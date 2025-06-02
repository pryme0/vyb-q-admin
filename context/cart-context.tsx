"use client";

import { CartItem, MenuItem } from "@/types";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from "react";
import { toast } from "sonner";

interface CartContextType {
  items: CartItem[];
  addToCart: (menuItem: MenuItem, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const hasMountedRef = useRef(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
      }
    }
    hasMountedRef.current = true;
  }, []);

  // Persist cart to localStorage on change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (menuItem: MenuItem, quantity = 1) => {
    setItems((currentItems) => {
      const existingItemIndex = currentItems.findIndex(
        (item) => item.menuItem.id === menuItem.id
      );

      const updatedItems = [...currentItems];

      if (existingItemIndex > -1) {
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
        };
        if (hasMountedRef.current) {
          toast.success(`${menuItem.name} quantity updated in cart`, {
            duration: 2000,
          });
        }
      } else {
        updatedItems.push({ menuItem, quantity });
        if (hasMountedRef.current) {
          toast.success(`${menuItem.name} added to cart`, { duration: 2000 });
        }
      }

      return updatedItems;
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems((currentItems) => {
      const itemToRemove = currentItems.find(
        (item) => item.menuItem.id === itemId
      );
      if (itemToRemove && hasMountedRef.current) {
        toast.info(`${itemToRemove.menuItem.name} removed from cart`);
      }
      return currentItems.filter((item) => item.menuItem.id !== itemId);
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.menuItem.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    if (hasMountedRef.current) {
      toast.info("Cart cleared");
    }
  };

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const subtotal = items.reduce(
    (total, item) => total + item.menuItem.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

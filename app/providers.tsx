"use client";

import { CartProvider } from "@/context/cart-context";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <CartProvider>
        {children}
        <Toaster position="top-center" richColors />
      </CartProvider>
    </ThemeProvider>
  );
}

"use client";

import { useSidebarStore } from "@/store";
import { cn } from "@/lib/utils";

interface MainContentProps {
  children: React.ReactNode;
}

export function MainContent({ children }: MainContentProps) {
  const { isCollapsed } = useSidebarStore();

  return (
    <main
      className={cn(
        "flex-1 overflow-y-auto p-6 transition-all duration-300",
        "ml-0 md:ml-64", // Default margin for expanded sidebar
        isCollapsed && "md:ml-20" // Smaller margin for collapsed sidebar
      )}
    >
      {children}
    </main>
  );
}

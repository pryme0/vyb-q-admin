"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Package,
  Settings,
  FileText,
  ChefHat,
  Clock,
  LogOut,
  Wine,
  Menu, // Hamburger icon for mobile
  X, // Close icon for mobile
  ChevronsLeft, // Icon for collapsing on desktop
  ChevronsRight, // Icon for expanding on desktop
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Orders",
    href: "/orders",
    icon: ShoppingBag,
  },
  {
    title: "Customers",
    href: "/customers",
    icon: Users,
  },
  {
    title: "Menu Items",
    href: "/menu-items",
    icon: ChefHat,
  },
  {
    title: "Bar Items",
    href: "/bar-items",
    icon: Wine,
  },
  {
    title: "Inventory",
    href: "/inventory",
    icon: Package,
  },
  {
    title: "Reservations",
    href: "/reservations",
    icon: Clock,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileText,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false); // State for mobile sidebar open/close
  const [isCollapsed, setIsCollapsed] = useState(false); // State for desktop sidebar collapsed/expanded

  return (
    <>
      {/* Mobile Hamburger menu button */}
      <div className="md:hidden p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm"
        >
          {isMobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile Overlay when sidebar is open */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={cn(
          "flex flex-col border-r bg-background fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out",
          // Width adjustments
          "w-1/2 md:w-64", // Mobile: half screen; desktop: default 64
          isCollapsed && "md:w-20", // Collapsed width on desktop

          // Visibility toggle
          "md:translate-x-0", // Show on md and up
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header Section */}
        <div className="relative p-6 flex items-center justify-between">
          <h1
            className={cn(
              "text-xl font-bold transition-opacity duration-300",
              isCollapsed && "opacity-0 pointer-events-none"
            )}
          >
            Bliss Lounge
          </h1>
          {/* Collapse/Expand button for desktop */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex absolute top-1/2 -right-4 -translate-y-1/2 bg-background hover:bg-muted/50 rounded-full border border-gray-200 shadow-sm"
          >
            {isCollapsed ? (
              <ChevronsRight className="h-4 w-4" />
            ) : (
              <ChevronsLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation Items */}
        <ScrollArea className="flex-1 px-3">
          <div className="space-y-1">
            {sidebarNavItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2",
                  pathname === item.href && "bg-secondary",
                  isCollapsed && "justify-center"
                )}
                asChild
                onClick={() => setIsMobileOpen(false)}
              >
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  <span className={cn(isCollapsed && "hidden")}>
                    {item.title}
                  </span>
                </Link>
              </Button>
            ))}
          </div>
        </ScrollArea>

        {/* Footer Section (Logout) */}
        <div className="p-4 mt-auto">
          <Separator className="mb-4" />
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50",
              isCollapsed && "justify-center"
            )}
            onClick={() => setIsMobileOpen(false)}
          >
            <LogOut className="h-4 w-4" />
            <span className={cn(isCollapsed && "hidden")}>Logout</span>
          </Button>
        </div>
      </aside>
    </>
  );
}

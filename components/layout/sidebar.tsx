"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
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
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
} from "lucide-react";
import { useAuthStore } from "@/store";

const sidebarNavItems = [
  { title: "Dashboard", href: "/dashboard/overview", icon: LayoutDashboard },
  { title: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { title: "Customers", href: "/dashboard/customers", icon: Users },
  { title: "Menu Items", href: "/dashboard/menu-items", icon: ChefHat },
  { title: "Inventory", href: "/dashboard/inventory", icon: Package },
  { title: "Reservations", href: "/dashboard/reservations", icon: Clock },
  { title: "Reports", href: "/dashboard/reports", icon: FileText },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface SidebarProps {
  isMobileOpen: boolean;
  toggleMobile: () => void;
}

export function Sidebar({ isMobileOpen, toggleMobile }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const { logout } = useAuthStore();

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[998] lg:hidden transition-opacity duration-300 ease-in-out"
          onClick={toggleMobile}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-screen bg-white border-r shadow-lg z-[999]
          w-64 flex flex-col
          transform transition-all duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:sticky lg:shadow-none
          ${isCollapsed ? "lg:w-20" : "lg:w-64"}
        `}
      >
        {/* Collapse Button (Desktop only) */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:block absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1 shadow-sm hover:shadow-md z-10 transition-shadow"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>

        <div className="p-6 flex items-center gap-2 border-b lg:border-b-0">
          {isCollapsed && !isMobileOpen ? (
            <span className="text-2xl font-bold text-primary">VQ</span> // or just logo icon
          ) : (
            <h1 className="text-xl font-bold whitespace-nowrap overflow-hidden text-ellipsis">
              Royal Bistro
            </h1>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {sidebarNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={isMobileOpen ? toggleMobile : undefined}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-gray-100 ${
                pathname === item.href
                  ? "bg-gray-100 text-gray-900 font-medium"
                  : "text-gray-700"
              } ${isCollapsed && !isMobileOpen ? "justify-center" : ""}`}
              title={isCollapsed && !isMobileOpen ? item.title : ""}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {(!isCollapsed || isMobileOpen) && (
                <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                  {item.title}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Logout */}
        <div className="p-4 border-t">
          <button
            onClick={() => {
              logout();
              isMobileOpen ? toggleMobile : undefined;
            }}
            className={`flex items-center gap-3 text-red-500 hover:bg-red-50 p-3 rounded-lg transition-colors w-full ${
              isCollapsed && !isMobileOpen ? "justify-center" : ""
            }`}
            title={isCollapsed && !isMobileOpen ? "Logout" : ""}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {(!isCollapsed || isMobileOpen) && (
              <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                Logout
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

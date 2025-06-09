"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Loader2 } from "lucide-react";

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, hasHydrated } = useAuthStore();
  const router = useRouter();

  const toggleMobile = () => {
    setIsMobileOpen((prev) => !prev);
  };

  // Redirect unauthenticated users
  useEffect(() => {
    if (hasHydrated && !user) {
      router.replace("/auth/signin");
    }
  }, [user, hasHydrated, router]);

  // Show loading while checking authentication
  if (!hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show loading while redirecting unauthenticated users
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Render protected dashboard content
  return (
    <div className="min-h-screen flex flex-col sm:flex-row bg-gray-50">
      <Sidebar isMobileOpen={isMobileOpen} toggleMobile={toggleMobile} />
      <div className="flex-1 flex flex-col transition-all duration-300">
        <Header toggleMobile={toggleMobile} isMobileOpen={isMobileOpen} />
        <main className="flex-1 w-full overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
}

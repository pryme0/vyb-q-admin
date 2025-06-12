import { useState, useEffect, useCallback } from "react";
import axios from "@/lib/axios.base";
import { useDebounce } from "@/hooks/use-debounce";

interface TopSellingItem {
  menuItemId: string;
  name: string;
  imageUrl: string;
  totalQuantity: number;
  totalRevenue: number;
}

interface RevenueGraphPoint {
  date: string;
  revenue: number;
}

interface AnalyticsResponse {
  totalRevenue: number;
  totalRevenueChange: number;
  totalOrders: number;
  totalOrdersChange: number;
  totalCustomers: number;
  totalCustomersChange: number;
  averageOrderValue: number;
  averageOrderValueChange: number;
  topSellingItems: TopSellingItem[];
  revenueGraph: RevenueGraphPoint[];
}

interface MenuItem {
  id: string;
  name: string;
}

interface UseAnalyticsProps {
  startDate?: Date;
  endDate?: Date;
  menuItemIds?: string[];
  enabled?: boolean; // New prop to control fetching
}

export const useAnalytics = ({ startDate, endDate }: UseAnalyticsProps) => {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async (params: URLSearchParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<AnalyticsResponse>("/analytics", {
        params,
      });
      setAnalytics(response.data);
    } catch (err) {
      setError("Failed to fetch analytics data");
      console.error("Analytics fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMenuItems = useCallback(async () => {
    try {
      const response = await axios.get("/menu-items");
      console.log("Menu items response:", response.data);
      const items = Array.isArray(response.data) ? response.data : [];
      setMenuItems(items);
    } catch (err) {
      console.error("Failed to fetch menu items:", err);
      setMenuItems([]);
    }
  }, []);

  // Create params
  const params = new URLSearchParams();
  if (startDate)
    params.append("startDate", startDate.toISOString().split("T")[0]);
  if (endDate) params.append("endDate", endDate.toISOString().split("T")[0]);

  // Debounce params
  const debouncedParams = useDebounce(params.toString(), 500);

  useEffect(() => {
    const params = new URLSearchParams(debouncedParams);
    fetchAnalytics(params);

    fetchMenuItems(); // Always fetch menu items
  }, [debouncedParams, fetchAnalytics, fetchMenuItems]);

  return { analytics, menuItems, loading, error, refetch: fetchAnalytics };
};

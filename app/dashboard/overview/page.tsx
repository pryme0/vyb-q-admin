"use client";

import { useState, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview } from "@/components/dashboard/overview";
import { RecentOrders } from "@/components/dashboard/recent-orders";
import { TopSellingItems } from "@/components/dashboard/top-selling-items";
import { DollarSign, Users, ShoppingBag, TrendingUp } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Button } from "@/components/ui/button";
import { formatNaira } from "@/lib/utils";

export default function DashboardPage() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [applyFilters, setApplyFilters] = useState(false);

  const { analytics, menuItems, loading, error } = useAnalytics({
    startDate: startDate ?? undefined,
    endDate: endDate ?? undefined,
  });

  const menuItemOptions = Array.isArray(menuItems)
    ? menuItems.map((item) => ({
        value: item.id,
        label: item.name,
      }))
    : [];

  const handleFilter = () => {
    setApplyFilters(true);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8 w-full">
      <h1 className="text-2xl sm:text-3xl font-bold">Dashboard Overview</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-1">
          <label className="text-sm font-medium">Date Range</label>
          <div className="flex gap-2">
            <DatePicker
              selected={startDate}
              onChange={(date) => {
                setStartDate(date);
                setApplyFilters(false);
              }}
              placeholderText="Start Date"
              className="w-full border px-3 py-2 rounded-md text-sm"
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => {
                setEndDate(date);
                setApplyFilters(false);
              }}
              placeholderText="End Date"
              className="w-full border px-3 py-2 rounded-md text-sm"
            />
          </div>
        </div>

        <Button onClick={handleFilter} className="h-10">
          Apply Filters
        </Button>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Revenue
                </p>
                <h3 className="text-xl sm:text-2xl font-bold">
                  {formatNaira(analytics?.totalRevenue || 0)}
                </h3>
                <p
                  className={`text-xs ${
                    analytics && analytics?.totalRevenueChange >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {analytics && analytics?.totalRevenueChange >= 0 ? "+" : ""}
                  {(analytics && analytics?.totalRevenueChange?.toFixed(1)) ||
                    "0.0"}
                  % from last period
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Orders
                </p>
                <h3 className="text-xl sm:text-2xl font-bold">
                  {analytics?.totalOrders || 0}
                </h3>
                <p
                  className={`text-xs ${
                    analytics && analytics?.totalOrdersChange >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {analytics && analytics?.totalOrdersChange >= 0 ? "+" : ""}
                  {analytics?.totalOrdersChange?.toFixed(1) || "0.0"}% from last
                  period
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Customers
                </p>
                <h3 className="text-xl sm:text-2xl font-bold">
                  {analytics?.totalCustomers || 0}
                </h3>
                <p
                  className={`text-xs ${
                    analytics && analytics?.totalCustomersChange >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {analytics && analytics?.totalCustomersChange >= 0 ? "+" : ""}
                  {analytics?.totalCustomersChange?.toFixed(1) || "0.0"}% from
                  last period
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Avg. Order Value
                </p>
                <h3 className="text-xl sm:text-2xl font-bold">
                  {formatNaira(analytics?.averageOrderValue || 0)}
                </h3>
                <p
                  className={`text-xs ${
                    analytics && analytics?.averageOrderValueChange >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {analytics && analytics?.averageOrderValueChange >= 0
                    ? "+"
                    : ""}
                  {analytics?.averageOrderValueChange?.toFixed(1) || "0.0"}%
                  from last period
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Top Items */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Overview data={analytics?.revenueGraph || []} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Top Selling Items</CardTitle>
          </CardHeader>
          <CardContent>
            <TopSellingItems items={analytics?.topSellingItems || []} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentOrders />
        </CardContent>
      </Card>
    </div>
  );
}

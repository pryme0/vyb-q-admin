"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview } from "@/components/dashboard/overview";
import { RecentOrders } from "@/components/dashboard/recent-orders";
import { TopSellingItems } from "@/components/dashboard/top-selling-items";
import {
  DollarSign,
  Users,
  ShoppingBag,
  TrendingUp,
  Calendar,
  Loader2,
} from "lucide-react";
import { useAnalytics, useGetInventoryMetrics } from "@/hooks";
import { Input } from "@/components/ui/input";
import { formatNaira } from "@/lib/utils";
import { format, subDays } from "date-fns";

export default function DashboardPage() {
  const [startDate, setStartDate] = useState<any>(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState<any>(new Date());

  const {
    analytics,
    loading: isAnalyticsLoading,
    error: analyticsError,
  } = useAnalytics({
    startDate,
    endDate,
  });

  const {
    data: inventoryMetrics,
    isLoading: isMetricsLoading,
    error: metricsError,
  } = useGetInventoryMetrics({
    startDate,
    endDate,
  });

  if (analyticsError || metricsError) {
    return (
      <div className="text-center py-8 text-red-600">
        Failed to load data: {analyticsError || metricsError}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8 w-full">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>

      {/* Filters */}
      <div className="border rounded-lg p-4 bg-card">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium text-muted-foreground">
              Start Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="date"
                value={format(startDate, "yyyy-MM-dd")}
                onChange={(e) => setStartDate(new Date(e.target.value))}
                className="pl-10 w-full"
              />
            </div>
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-muted-foreground">
              End Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="date"
                value={format(endDate, "yyyy-MM-dd")}
                onChange={(e) => setEndDate(new Date(e.target.value))}
                className="pl-10 w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {isAnalyticsLoading || isMetricsLoading ? (
        <div className="text-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />
        </div>
      ) : (
        <div className="border rounded-lg p-4 bg-card">
          <h2 className="text-xl font-semibold mb-4">Summary</h2>
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
                        analytics?.totalRevenueChange >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {analytics?.totalRevenueChange >= 0 ? "+" : ""}
                      {analytics?.totalRevenueChange?.toFixed(1) || "0.0"}% from
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
                        analytics?.totalOrdersChange >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {analytics?.totalOrdersChange >= 0 ? "+" : ""}
                      {analytics?.totalOrdersChange?.toFixed(1) || "0.0"}% from
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
                        analytics?.totalCustomersChange >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {analytics?.totalCustomersChange >= 0 ? "+" : ""}
                      {analytics?.totalCustomersChange?.toFixed(1) || "0.0"}%
                      from last period
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
                        analytics?.averageOrderValueChange >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {analytics?.averageOrderValueChange >= 0 ? "+" : ""}
                      {analytics?.averageOrderValueChange?.toFixed(1) || "0.0"}%
                      from last period
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Inventory Value
                    </p>
                    <h3 className="text-xl sm:text-2xl font-bold">
                      {formatNaira(
                        inventoryMetrics?.total_inventory_value || 0
                      )}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Variance Cost
                    </p>
                    <h3 className="text-xl sm:text-2xl font-bold">
                      {formatNaira(inventoryMetrics?.total_variance_cost || 0)}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Profit/Loss Value
                    </p>
                    <h3
                      className={`text-xl sm:text-2xl font-bold ${
                        inventoryMetrics?.profit_loss_value >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {formatNaira(inventoryMetrics?.profit_loss_value || 0)}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Charts and Top Items */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {isAnalyticsLoading ? (
              <div className="text-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />
              </div>
            ) : (
              <Overview data={analytics?.revenueGraph || []} />
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Top Selling Items</CardTitle>
          </CardHeader>
          <CardContent>
            {isAnalyticsLoading ? (
              <div className="text-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />
              </div>
            ) : (
              <TopSellingItems items={analytics?.topSellingItems || []} />
            )}
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

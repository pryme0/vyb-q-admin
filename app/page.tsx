import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview } from "@/components/dashboard/overview";
import { RecentOrders } from "@/components/dashboard/recent-orders";
import { TopSellingItems } from "@/components/dashboard/top-selling-items";
import { DollarSign, Users, ShoppingBag, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold">Dashboard Overview</h1>

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
                <h3 className="text-xl sm:text-2xl font-bold">₦4,125,000</h3>
                <p className="text-xs text-green-500">+15.2% from last month</p>
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
                <h3 className="text-xl sm:text-2xl font-bold">2,145</h3>
                <p className="text-xs text-green-500">+10.5% from last month</p>
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
                <h3 className="text-xl sm:text-2xl font-bold">1,234</h3>
                <p className="text-xs text-green-500">+18.7% from last month</p>
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
                <h3 className="text-xl sm:text-2xl font-bold">₦15,750</h3>
                <p className="text-xs text-green-500">+7.2% from last month</p>
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
            <Overview />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Top Selling Items</CardTitle>
          </CardHeader>
          <CardContent>
            <TopSellingItems />
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

"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOrders } from "@/hooks/use-order";
import { formatNaira } from "@/lib/utils";

export function RecentOrders() {
  const { data, isLoading, error } = useOrders({ limit: 5, page: 1 });

  if (isLoading) {
    return <div>Loading recent orders...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500">Error fetching orders: {error.message}</div>
    );
  }

  const orders = data?.data || [];

  if (orders.length === 0) {
    return <div className="text-muted-foreground">No recent orders found</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Items</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">#{index + 1} </TableCell>
            <TableCell>{order.customer.fullName}</TableCell>
            <TableCell>
              {order.orderItems.map((item) => item.menuItem.name).join(", ") ||
                "No items"}
            </TableCell>
            <TableCell>{order.totalPrice}</TableCell>
            <TableCell>
              <div
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                  ${
                    order.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : order.status === "out-for-delivery"
                      ? "bg-blue-100 text-blue-800"
                      : order.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800" // cancelled
                  }`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </div>
            </TableCell>
            <TableCell>
              {new Date(order.createdAt).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const recentOrders = [
  {
    id: "1",
    customer: "John Doe",
    items: "Grilled Fish, Chapman",
    total: "₦8,500",
    status: "Delivered",
    date: "2024-02-20",
  },
  {
    id: "2",
    customer: "Sarah Smith",
    items: "Pepper Soup, Beer",
    total: "₦6,200",
    status: "Processing",
    date: "2024-02-20",
  },
  {
    id: "3",
    customer: "Michael Johnson",
    items: "Jollof Rice Special, Wine",
    total: "₦12,000",
    status: "Pending",
    date: "2024-02-20",
  },
  {
    id: "4",
    customer: "Emma Wilson",
    items: "Seafood Okra, Cocktails",
    total: "₦15,800",
    status: "Delivered",
    date: "2024-02-19",
  },
  {
    id: "5",
    customer: "David Brown",
    items: "Assorted Small Chops",
    total: "₦7,500",
    status: "Delivered",
    date: "2024-02-19",
  },
];

export function RecentOrders() {
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
        {recentOrders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">#{order.id}</TableCell>
            <TableCell>{order.customer}</TableCell>
            <TableCell>{order.items}</TableCell>
            <TableCell>{order.total}</TableCell>
            <TableCell>
              <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                  order.status === 'Processing' ? 'bg-blue-100 text-blue-800' : 
                  'bg-yellow-100 text-yellow-800'}`}>
                {order.status}
              </div>
            </TableCell>
            <TableCell>{order.date}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
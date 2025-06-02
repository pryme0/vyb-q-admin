"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";

export function TopSellingItems() {
  const items = [
    {
      name: "Grilled Fish",
      image: "https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg",
      orders: 245,
      revenue: "₦1,837,500",
    },
    {
      name: "Jollof Rice Special",
      image: "https://images.pexels.com/photos/7613568/pexels-photo-7613568.jpeg",
      orders: 198,
      revenue: "₦1,485,000",
    },
    {
      name: "Chapman Cocktail",
      image: "https://images.pexels.com/photos/2789328/pexels-photo-2789328.jpeg",
      orders: 156,
      revenue: "₦624,000",
    },
  ];

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.name} className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <img src={item.image} alt={item.name} className="object-cover" />
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{item.name}</p>
            <p className="text-sm text-muted-foreground">{item.orders} orders</p>
          </div>
          <div className="text-sm font-medium">{item.revenue}</div>
        </div>
      ))}
    </div>
  );
}
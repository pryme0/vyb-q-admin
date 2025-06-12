"use client";

import { Avatar } from "@/components/ui/avatar";
import { formatNaira } from "@/lib/utils";

interface TopSellingItem {
  menuItemId: string;
  name: string;
  imageUrl: string;
  totalQuantity: number;
  totalRevenue: number;
}

interface TopSellingItemsProps {
  items: TopSellingItem[];
}

export function TopSellingItems({ items }: TopSellingItemsProps) {
  return (
    <div className="space-y-4">
      {items.length === 0 && (
        <p className="text-sm text-muted-foreground">No items found</p>
      )}
      {items.map((item) => (
        <div key={item.menuItemId} className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <img
              src={item.imageUrl || "https://via.placeholder.com/150"}
              alt={item.name}
              className="object-cover"
            />
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{item.name}</p>
            <p className="text-sm text-muted-foreground">
              {item.totalQuantity} orders
            </p>
          </div>
          <div className="text-sm font-medium">
            {formatNaira(item.totalRevenue)}
          </div>
        </div>
      ))}
    </div>
  );
}

"use client";

import { useBestDiscount } from "@/hooks";
import { Badge } from "@/components/ui/badge";
import { Tag, Percent, DollarSign } from "lucide-react";
import { DiscountType } from "@/types";

interface MenuItemDiscountBadgeProps {
  menuItemId: string;
  originalPrice: number;
}

export function MenuItemDiscountBadge({
  menuItemId,
  originalPrice,
}: MenuItemDiscountBadgeProps) {
  const { data: discountData, isLoading } = useBestDiscount(menuItemId);

  if (isLoading) return null;

  if (!discountData || !discountData.discount) {
    return (
      <div className="flex items-center">
        <span className="font-semibold">
          ₦{Number(originalPrice).toLocaleString()}
        </span>
      </div>
    );
  }

  const { discount, discountedPrice } = discountData;
  const savings = originalPrice - discountedPrice;

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-green-600">
          ₦{Number(discountedPrice).toLocaleString()}
        </span>
        <span className="text-sm text-gray-400 line-through">
          ₦{Number(originalPrice).toLocaleString()}
        </span>
      </div>
      <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
        <Tag className="w-3 h-3 mr-1" />
        {discount.type === DiscountType.PERCENTAGE ? (
          <>
            <Percent className="w-3 h-3 mr-1" />
            {discount.value}% off
          </>
        ) : (
          <>
            <DollarSign className="w-3 h-3 mr-1" />
            ₦{discount.value} off
          </>
        )}
        {" • Save ₦"}
        {Number(savings).toLocaleString()}
      </Badge>
    </div>
  );
}


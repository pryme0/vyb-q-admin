"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InventoryUnitEnum } from "@/types";

interface InventoryFormProps {
  initialData?: {
    itemName: string;
    quantity: number;
    unitPrice: number;
    description?: string;
    unit: InventoryUnitEnum;
  };
  onSubmit: (data: {
    itemName: string;
    quantity: number;
    unitPrice: number;
    description?: string;
    unit: InventoryUnitEnum;
  }) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function InventoryForm({
  initialData,
  onSubmit,
  onCancel,
  loading,
}: InventoryFormProps) {
  const [itemName, setItemName] = useState(initialData?.itemName || "");
  const [quantity, setQuantity] = useState(
    initialData?.quantity?.toString() || ""
  );
  const [unitPrice, setUnitPrice] = useState(
    initialData?.unitPrice?.toString() || ""
  );
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [unit, setUnit] = useState(initialData?.unit || InventoryUnitEnum.KG);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      itemName,
      quantity: Number(quantity),
      unitPrice: Number(unitPrice),
      description: description || undefined,
      unit,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="itemName">Item Name</Label>
        <Input
          id="itemName"
          placeholder="Enter item name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          type="number"
          placeholder="Enter quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="unitPrice">Unit Price</Label>
        <Input
          id="unitPrice"
          type="number"
          step="0.01"
          placeholder="Enter unit price"
          value={unitPrice}
          onChange={(e) => setUnitPrice(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          placeholder="Enter description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="unit">Unit</Label>
        <Select
          value={unit}
          onValueChange={(value) => setUnit(value as InventoryUnitEnum)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select unit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={InventoryUnitEnum.KG}>KG</SelectItem>
            <SelectItem value={InventoryUnitEnum.LITERS}>Liters</SelectItem>
            <SelectItem value={InventoryUnitEnum.PIECES}>Pieces</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          loading={loading}
          type="button"
          variant="ghost"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}

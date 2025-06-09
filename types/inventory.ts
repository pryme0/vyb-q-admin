export enum InventoryUnitEnum {
  KG = "kg",
  LITERS = "liters",
  PIECES = "pieces",
}

export enum InventoryStatusEnum {
  INSTOCK = "in-stock",
  OUTOFSTOCK = "out-of-stock",
}

export type InventoryItem = {
  id: string;
  itemName: string;
  description: string;
  unitPrice: number;
  quantity: number;
  status?: InventoryStatusEnum;
  unit: InventoryUnitEnum;
  createdAt?: string;
  updatedAt?: string;
};

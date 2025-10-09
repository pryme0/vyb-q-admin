export enum DiscountType {
  PERCENTAGE = "percentage",
  FIXED_AMOUNT = "fixed_amount",
}

export enum DiscountScope {
  SPECIFIC_ITEMS = "specific_items",
  ALL_ITEMS = "all_items",
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  categoryId: string;
}

export interface Discount {
  id: string;
  name: string;
  description?: string;
  type: DiscountType;
  value: number;
  scope: DiscountScope;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  menuItems: MenuItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateDiscountDto {
  name: string;
  description?: string;
  type: DiscountType;
  value: number;
  scope: DiscountScope;
  menuItemIds?: string[];
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface UpdateDiscountDto {
  name?: string;
  description?: string;
  type?: DiscountType;
  value?: number;
  scope?: DiscountScope;
  menuItemIds?: string[];
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface PaginatedDiscountsResponse {
  data: Discount[];
  total: number;
  page: number;
  limit: number;
}

export interface BestDiscountResponse {
  discount: Discount | null;
  discountedPrice: number;
  originalPrice: number;
}


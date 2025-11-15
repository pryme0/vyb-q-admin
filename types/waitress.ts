export interface Waitress {
  id: string;
  waitressId: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role: "waitress" | "cashier";
  createdAt: string;
  updatedAt: string;
  waitressOrders?: WaitressOrder[];
}

export interface CreateWaitressDto {
  email: string;
  fullName: string;
  phoneNumber?: string;
  password: string;
  role?: "waitress" | "cashier";
}

export interface UpdateWaitressDto {
  fullName?: string;
  phoneNumber?: string;
  role?: "waitress" | "cashier";
}

export interface WaitressOrder {
  id: string;
  orderId: string;
  name?: string;
  waitress: Waitress;
  orderItems: OrderItem[];
  totalPrice: number;
  status: "open" | "closed";
  closedAt?: string;
  closedBy?: Waitress;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItem: {
    id: string;
    name: string;
    description: string;
    price: number;
    category: {
      name: string;
    };
    isAvailable: boolean;
    imageUrl?: string;
  };
  quantity: number;
  price: number;
}

export interface WaitressOrderQueryParams {
  page?: number;
  limit?: number;
  waitressId?: string;
  status?: "open" | "closed";
  orderId?: string;
}

export interface UpdateWaitressOrderDto {
  status?: "open" | "closed";
  name?: string;
}

export interface WaitressResponse {
  data: Waitress[];
  total: number;
  page: number;
  limit: number;
}

export interface WaitressOrderResponse {
  data: WaitressOrder[];
  total: number;
  page: number;
  limit: number;
}


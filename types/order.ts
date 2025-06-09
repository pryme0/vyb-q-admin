export type Category = {
  id: string;
  name: string;
  createdAt?: string;
  updatedA?: string;
};

export interface CreateOrderDto {
  customerId: string;

  items: {
    menuItemId: string;
    quantity: number;
  }[];

  totalPrice: number;

  deliveryAddress: string;
}

export interface CreateOrderResponse {
  authorizationUrl: string;

  access_code: string;

  reference: string;
}

export interface Order {
  id: string;
  totalPrice: string;
  status: "pending" | "out-for-delivery" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
  deliveryAddress: string;
  customer: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    addresses: string[];
  };
  orderItems: {
    id: string;
    orderId: string;
    menuItemId: string;
    quantity: number;
    price: string;
    menuItem: {
      id: string;
      name: string;
      description: string;
      imageUrl: string;
      price: string;
      categoryId: string;
      isAvailable: boolean;
      createdAt: string;
      updatedAt: string;
    };
  }[];
  transactions: {
    id: string;
    amount: string;
    paymentMethod: string;
    status: "pending" | "completed" | "failed";
    referenceId: string;
    createdAt: string;
    updatedAt: string;
  }[];
}

// Response shape from the backend API
export interface OrdersResponse {
  data: Order[];
  limit: number;
  page: boolean;
  total: boolean;
}

export interface UseOrdersParams {
  customerId?: string;
  limit: number;
  page: number;
}

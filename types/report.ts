export enum ReportType {
  ORDERS = "orders",
  RESERVATIONS = "reservations",
  INVENTORY = "inventory",
}

export enum ReportFormat {
  JSON = "json",
  CSV = "csv",
  PDF = "pdf",
}

export interface ReportRequest {
  type: ReportType;
  startDate: string;
  endDate: string;
  format: ReportFormat;
  emailRecipients?: string[];
}

export interface OrderReport {
  totalOrders: number;
  totalRevenue: number;
  statusBreakdown: { [status: string]: number };
  orders: Array<{
    id: string;
    customerName: string;
    totalPrice: number;
    status: string;
    createdAt: string;
  }>;
}

export interface ReservationReport {
  totalReservations: number;
  totalGuests: number;
  statusBreakdown: { [status: string]: number };
  reservations: Array<{
    id: string;
    name: string;
    email: string;
    date: string;
    time: string;
    guests: number;
    status: string;
    createdAt: string;
  }>;
}

export interface InventoryReport {
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  statusBreakdown: { [status: string]: number };
  items: Array<{
    id: string;
    itemName: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    totalValue: number;
    status: string;
  }>;
}

export type ReportResponse =
  | OrderReport
  | ReservationReport
  | InventoryReport
  | { message: string };

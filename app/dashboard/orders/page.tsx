"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Search, Plus, Loader2, Eye } from "lucide-react";
import { useOrders, useOrderDetails, useUpdateOrder } from "@/hooks";
import { Order } from "@/types";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [page, setPage] = useState(1);
  const [viewOrderId, setViewOrderId] = useState<string>("");
  const [isPageVisible, setIsPageVisible] = useState(true);
  const limit = 10;

  const {
    data: resp,
    isLoading,
    isError,
  } = useOrders({
    page,
    limit,
    queryOptions: {
      refetchInterval: isPageVisible ? 60000 : false, // Refetch every 1 minute if page is visible
    },
  });
  const orders = resp?.data || [];
  const totalPages = Math.ceil((Number(resp?.total) || 0) / limit);

  const { data: details, isLoading: isDetailsLoading } =
    useOrderDetails(viewOrderId);
  const { mutate: updateOrder, isPending: isUpdating } = useUpdateOrder(
    viewOrderId || ""
  );

  // Handle page visibility for refetching
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(document.visibilityState === "visible");
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const filtered = orders.filter((o) =>
    o.customer.fullName.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  // Deduplicate orderItems by id
  const uniqueOrderItems = details?.orderItems
    ? Array.from(
        new Map(details.orderItems.map((item) => [item.id, item])).values()
      )
    : [];

  const handleStatusUpdate = (id: string, status: string) => {
    updateOrder(
      { status },
      {
        onSuccess: () => {
          toast.success(`Order updated to ${status}!`);
        },
        onError: () => {
          toast.error("Failed to update status");
        },
      }
    );
  };

  if (isError) {
    return (
      <div className="text-center py-8 text-red-600">Failed to load orders</div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Orders</h1>
        {/* Placeholder for future "New Order" button */}
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative w-full sm:min-w-[300px] sm:flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by customer name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-10 w-full"
          />
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">ID</TableHead>
              <TableHead className="whitespace-nowrap">Customer</TableHead>
              <TableHead className="whitespace-nowrap">Total</TableHead>
              <TableHead className="whitespace-nowrap">Status</TableHead>
              <TableHead className="whitespace-nowrap">Date</TableHead>
              <TableHead className="whitespace-nowrap">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((o: Order) => (
                <TableRow key={o.id}>
                  <TableCell className="whitespace-nowrap">
                    #{o.id.slice(0, 8)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {o.customer.fullName}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    ₦{parseFloat(o.totalPrice.toString()).toFixed(2)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                        ${
                          o.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : o.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : o.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : o.status === "out-for-delivery"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex gap-2 items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewOrderId(o.id)}
                        aria-label={`View order ${o.id}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Select
                        onValueChange={(value) =>
                          handleStatusUpdate(o.id, value)
                        }
                        defaultValue={o.status}
                        disabled={isUpdating}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "pending",
                            "completed",
                            "cancelled",
                            "out-for-delivery",
                          ].map((s) => (
                            <SelectItem key={s} value={s}>
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <p className="text-sm text-muted-foreground">
          Showing {(page - 1) * limit + 1} to{" "}
          {Math.min(page * limit, resp?.total || 0)} of {resp?.total || 0}{" "}
          orders
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* View Dialog */}
      <Dialog open={!!viewOrderId} onOpenChange={() => setViewOrderId("")}>
        <DialogContent className="max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              {isDetailsLoading ? (
                <div className="py-8 text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                </div>
              ) : details ? (
                <div className="space-y-4">
                  <div>
                    <strong>ID:</strong> {details.id}
                  </div>
                  <div>
                    <strong>Customer:</strong> {details.customer.fullName}
                  </div>
                  <div>
                    <strong>Delivery Address:</strong> {details.deliveryAddress}
                  </div>
                  <div>
                    <strong>Total:</strong> ₦
                    {parseFloat(details.totalPrice.toString()).toFixed(2)}
                  </div>
                  <div>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                        ${
                          details.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : details.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : details.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : details.status === "out-for-delivery"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {details.status.charAt(0).toUpperCase() +
                        details.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <strong>Created At:</strong>{" "}
                    {new Date(details.createdAt).toLocaleString()}
                  </div>
                  <div>
                    <strong>Updated At:</strong>{" "}
                    {new Date(details.updatedAt).toLocaleString()}
                  </div>
                  <div>
                    <strong>Items:</strong>
                    <ul className="mt-2 space-y-2">
                      {uniqueOrderItems.map((item) => (
                        <li
                          key={item.id}
                          className="flex justify-between items-center"
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src={item.menuItem.imageUrl}
                              alt={item.menuItem.name}
                              className="w-10 h-10 object-cover rounded"
                            />
                            <div>
                              <p>{item.menuItem.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Quantity: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <p>₦{parseFloat(item.price.toString()).toFixed(2)}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-red-600">
                  Failed to load details
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setViewOrderId("")}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

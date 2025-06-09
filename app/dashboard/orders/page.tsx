"use client";

import { useState } from "react";
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
} from "@/components/ui/dialog";
import { Search, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useOrders, useOrderDetails, useUpdateOrder } from "@/hooks";
import { Order } from "@/types";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [viewOrderId, setViewOrderId] = useState<string>("");
  const limit = 10;

  const { data: resp, isLoading, isError } = useOrders({ page, limit });
  const orders = resp?.data || [];
  const totalPages = Math.ceil((Number(resp?.total) || 0) / limit);

  const { data: details, isLoading: isDetailsLoading } =
    useOrderDetails(viewOrderId);
  const updateOrder = useUpdateOrder(viewOrderId || "");

  const filtered = orders.filter((o) =>
    o.customer.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full p-4 space-y-6 flex flex-col">
      {/* Header + Search */}
      <div className="flex justify-between items-center flex-col sm:flex-row gap-4">
        <h1 className="text-2xl font-bold">Orders</h1>
        <div className="relative w-full sm:w-1/2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search orders..."
            className="pl-10"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="w-full border rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center p-4 text-center">
            Loading Orders ...
          </div>
        ) : isError ? (
          <div className="p-4 text-center text-red-500">
            Error loading orders.
          </div>
        ) : (
          <>
            <div className="w-full overflow-x-auto">
              <Table className="min-w-[700px]">
                <TableHeader className="bg-gray-100">
                  <TableRow>
                    {[
                      "ID",
                      "Customer",
                      "Total",
                      "Status",
                      "Date",
                      "Actions",
                    ].map((h) => (
                      <TableHead key={h}>{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((o: Order) => (
                    <TableRow key={o.id} className="hover:bg-gray-50">
                      <TableCell>{o.id.slice(0, 8)}</TableCell>
                      <TableCell>{o.customer.fullName}</TableCell>
                      <TableCell>
                        ₦{parseFloat(o.totalPrice.toString()).toFixed(2)}
                      </TableCell>
                      <TableCell className="capitalize">{o.status}</TableCell>
                      <TableCell>
                        {new Date(o.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setViewOrderId(o.id)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 flex flex-wrap justify-center gap-2">
                <Button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </Button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i}
                    variant={i + 1 === page ? "default" : "outline"}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* View/Edit Dialog */}
      <Dialog open={!!viewOrderId} onOpenChange={() => setViewOrderId("")}>
        <DialogContent className="sm:max-w-lg max-w-full p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Order Details
            </DialogTitle>
          </DialogHeader>

          {isDetailsLoading ? (
            <div className="py-8 text-center">
              <Loader2 className="animate-spin" />
            </div>
          ) : details ? (
            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Order ID</p>
                  <p className="text-lg font-semibold">{details.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Customer</p>
                  <p className="text-lg font-semibold">
                    {details.customer.fullName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <select
                    value={details.status}
                    onChange={(e) =>
                      updateOrder.mutate({ status: e.target.value })
                    }
                    className="border rounded px-3 py-2 w-full mt-1"
                  >
                    {[
                      "pending",
                      "completed",
                      "cancelled",
                      "out-for-delivery",
                    ].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Delivery Address
                  </p>
                  <p className="text-lg">{details.deliveryAddress}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-lg font-semibold">
                    ₦{parseFloat(details.totalPrice.toString()).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Date</p>
                  <p className="text-lg">
                    {new Date(details.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              {/* Order Items */}
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Items</p>
                <div className="border rounded-md p-3 max-h-60 overflow-y-auto">
                  <ul className="space-y-3">
                    {details.orderItems.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center gap-4 border-b pb-2 last:border-b-0"
                      >
                        <div className="w-16 h-16 flex-shrink-0 border rounded overflow-hidden">
                          <img
                            src={item.menuItem.imageUrl}
                            alt={item.menuItem.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{item.menuItem.name}</p>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            ₦{parseFloat(item.price.toString()).toFixed(2)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-red-500">
              Failed to load details.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

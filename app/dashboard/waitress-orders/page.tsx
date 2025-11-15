"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ClipboardList,
  Search,
  Eye,
  XCircle,
  CheckCircle,
  Trash2,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  useWaitressOrders,
  useWaitresses,
  useToggleOrderStatus,
  useDeleteWaitressOrder,
  useDebounce,
} from "@/hooks";
import { toast } from "sonner";
import { format } from "date-fns";

export default function WaitressOrdersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [waitressFilter, setWaitressFilter] = useState<string>("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  const { data: ordersData, isLoading } = useWaitressOrders({
    page,
    limit: 20,
    orderId: debouncedSearch || undefined,
    status: statusFilter ? (statusFilter as "open" | "closed") : undefined,
    waitressId: waitressFilter || undefined,
  });

  const { data: waitressData } = useWaitresses(1, 100);
  const { closeOrder, reopenOrder, isPending: isTogglingStatus } =
    useToggleOrderStatus();
  const deleteMutation = useDeleteWaitressOrder();

  const orders = ordersData?.data || [];
  const total = ordersData?.total || 0;
  const totalPages = Math.ceil(total / 20);
  const waitresses = waitressData?.data || [];

  const handleCloseOrder = async (id: string) => {
    try {
      await closeOrder(id);
      toast.success("Order closed successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to close order");
    }
  };

  const handleReopenOrder = async (id: string) => {
    try {
      await reopenOrder(id);
      toast.success("Order reopened successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reopen order");
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      await deleteMutation.mutateAsync(deletingId);
      toast.success("Order deleted successfully");
      setDeletingId(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete order");
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setWaitressFilter("");
    setPage(1);
  };

  const openOrders = orders.filter((o) => o.status === "open").length;
  const closedOrders = orders.filter((o) => o.status === "closed").length;
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalPrice), 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ClipboardList className="h-8 w-8" />
          Waitress Orders
        </h1>
        <p className="text-muted-foreground mt-1">
          View and manage orders created by waitresses
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Orders</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed Orders</CardTitle>
            <XCircle className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{closedOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <ClipboardList className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{totalRevenue.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Search & Filter Orders</CardTitle>
              <CardDescription>
                Search by Order ID and filter by status or waitress
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <Filter className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Order ID..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9"
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={waitressFilter}
              onValueChange={(value) => {
                setWaitressFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Waitresses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Waitresses</SelectItem>
                {waitresses.map((waitress) => (
                  <SelectItem key={waitress.id} value={waitress.id}>
                    {waitress.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Grid */}
      {isLoading ? (
        <Card>
          <CardContent className="py-10">
            <div className="text-center text-muted-foreground">
              Loading orders...
            </div>
          </CardContent>
        </Card>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="py-10">
            <div className="text-center text-muted-foreground">
              No orders found
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        Order #{order.orderId}
                      </CardTitle>
                      {order.name && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {order.name}
                        </p>
                      )}
                    </div>
                    <Badge
                      variant={order.status === "open" ? "default" : "secondary"}
                    >
                      {order.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">Waitress</p>
                    <p className="text-sm text-muted-foreground">
                      {order.waitress.fullName}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Items</p>
                    <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                      {order.orderItems.slice(0, 2).map((item) => (
                        <li key={item.id}>
                          {item.quantity}x {item.menuItem.name}
                        </li>
                      ))}
                      {order.orderItems.length > 2 && (
                        <li>+{order.orderItems.length - 2} more items</li>
                      )}
                    </ul>
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-sm font-medium">Total</p>
                    <p className="text-lg font-bold">
                      ₦{order.totalPrice.toLocaleString()}
                    </p>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {format(new Date(order.createdAt), "PPp")}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        router.push(`/dashboard/waitress-orders/${order.id}`)
                      }
                    >
                      <Eye className="mr-2 h-3 w-3" />
                      View
                    </Button>
                    {order.status === "open" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCloseOrder(order.id)}
                        disabled={isTogglingStatus}
                      >
                        <XCircle className="mr-2 h-3 w-3" />
                        Close
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReopenOrder(order.id)}
                        disabled={isTogglingStatus}
                      >
                        <CheckCircle className="mr-2 h-3 w-3" />
                        Reopen
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeletingId(order.id)}
                    >
                      <Trash2 className="h-3 w-3 text-red-600" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {(page - 1) * 20 + 1} to{" "}
                    {Math.min(page * 20, total)} of {total} orders
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <span className="flex items-center px-3 text-sm">
                      Page {page} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              order and all its items.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}


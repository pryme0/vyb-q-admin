"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit2,
  Trash2,
  XCircle,
  CheckCircle,
  User,
  Clock,
  Package,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useWaitressOrder,
  useUpdateOrderName,
  useRemoveOrderItems,
  useToggleOrderStatus,
  useDeleteWaitressOrder,
} from "@/hooks";
import { toast } from "sonner";
import { format } from "date-fns";

export default function WaitressOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [removingItemId, setRemovingItemId] = useState<string | null>(null);
  const [deletingOrder, setDeletingOrder] = useState(false);

  const { data: order, isLoading } = useWaitressOrder(id);
  const updateNameMutation = useUpdateOrderName();
  const removeItemsMutation = useRemoveOrderItems();
  const { closeOrder, reopenOrder, isPending: isTogglingStatus } =
    useToggleOrderStatus();
  const deleteMutation = useDeleteWaitressOrder();

  const handleUpdateName = async () => {
    if (!newName.trim()) {
      toast.error("Please enter a name");
      return;
    }

    try {
      await updateNameMutation.mutateAsync({ id, name: newName });
      toast.success("Order name updated successfully");
      setIsEditingName(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update name");
    }
  };

  const handleRemoveItem = async () => {
    if (!removingItemId) return;

    if (order && order.orderItems.length === 1) {
      toast.error("Cannot remove the last item. Delete the order instead.");
      setRemovingItemId(null);
      return;
    }

    try {
      await removeItemsMutation.mutateAsync({ id, orderItemIds: [removingItemId] });
      toast.success("Item removed successfully");
      setRemovingItemId(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to remove item");
    }
  };

  const handleToggleStatus = async () => {
    if (!order) return;

    try {
      if (order.status === "open") {
        await closeOrder(id);
        toast.success("Order closed successfully");
      } else {
        await reopenOrder(id);
        toast.success("Order reopened successfully");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to toggle status");
    }
  };

  const handleDeleteOrder = async () => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Order deleted successfully");
      router.push("/dashboard/waitress-orders");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete order");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="py-10">
            <div className="text-center text-muted-foreground">
              Loading order details...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="py-10">
            <div className="text-center text-muted-foreground">
              Order not found
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Order #{order.orderId}</h1>
            <p className="text-muted-foreground mt-1">
              Created {format(new Date(order.createdAt), "PPp")}
            </p>
          </div>
        </div>
        <Badge
          variant={order.status === "open" ? "default" : "secondary"}
          className="text-lg px-4 py-2"
        >
          {order.status}
        </Badge>
      </div>

      {/* Order Name Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Order Name</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setNewName(order.name || "");
                setIsEditingName(true);
              }}
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg">
            {order.name || <span className="text-muted-foreground">No name set</span>}
          </p>
        </CardContent>
      </Card>

      {/* Order Info */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waitress</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{order.waitress.fullName}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {order.waitress.email}
            </p>
            <p className="text-xs text-muted-foreground">
              ID: {order.waitress.waitressId}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{order.orderItems.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total Quantity:{" "}
              {order.orderItems.reduce((sum, item) => sum + item.quantity, 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Price</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{order.totalPrice.toLocaleString()}
            </div>
            {order.closedAt && (
              <p className="text-xs text-muted-foreground mt-1">
                Closed {format(new Date(order.closedAt), "PPp")}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
          <CardDescription>All items in this order</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.orderItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.menuItem.name}
                    </TableCell>
                    <TableCell>{item.menuItem.category.name}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">
                      ₦{item.price.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ₦{(item.quantity * item.price).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setRemovingItemId(item.id)}
                        disabled={order.status === "closed"}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-end mt-4 pr-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">
                ₦{order.totalPrice.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Order Actions</CardTitle>
          <CardDescription>Manage this order</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleToggleStatus}
              disabled={isTogglingStatus}
              variant={order.status === "open" ? "default" : "outline"}
            >
              {order.status === "open" ? (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Close Order
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Reopen Order
                </>
              )}
            </Button>

            <Button
              variant="destructive"
              onClick={() => setDeletingOrder(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Order
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Edit Name Dialog */}
      <Dialog open={isEditingName} onOpenChange={setIsEditingName}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Order Name</DialogTitle>
            <DialogDescription>
              Set a name for this order (e.g., "Table 5", "Room 305")
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter order name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingName(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateName}
              disabled={updateNameMutation.isPending}
            >
              {updateNameMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Item Confirmation */}
      <AlertDialog
        open={!!removingItemId}
        onOpenChange={() => setRemovingItemId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this item?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the item from the order and recalculate the total.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveItem}>
              Remove Item
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Order Confirmation */}
      <AlertDialog open={deletingOrder} onOpenChange={setDeletingOrder}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this order?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              order and all its items.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteOrder}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}


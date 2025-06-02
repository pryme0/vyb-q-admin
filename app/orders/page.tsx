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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Filter, Plus, Minus } from "lucide-react";

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Create order form state
  const [newOrder, setNewOrder] = useState({
    customer: "",
    phone: "",
    items: [{ name: "", quantity: 1, price: "" }],
    status: "Pending",
    notes: "",
  });

  // Edit order form state
  const [editOrder, setEditOrder] = useState({
    customer: "",
    phone: "",
    items: [],
    status: "",
    notes: "",
    total: "",
  });

  const [orders, setOrders] = useState([
    {
      id: "1",
      customer: "John Doe",
      phone: "+234 803 123 4567",
      items: "Grilled Fish, Chapman",
      itemsList: [
        { name: "Grilled Fish", quantity: 1, price: "6500" },
        { name: "Chapman", quantity: 2, price: "1000" },
      ],
      total: "₦8,500",
      status: "Delivered",
      date: "2024-02-20",
      notes: "Extra spicy please",
    },
    {
      id: "2",
      customer: "Sarah Smith",
      phone: "+234 805 987 6543",
      items: "Pepper Soup, Beer",
      itemsList: [
        { name: "Pepper Soup", quantity: 1, price: "4200" },
        { name: "Beer", quantity: 2, price: "1000" },
      ],
      total: "₦6,200",
      status: "Processing",
      date: "2024-02-20",
      notes: "Call before delivery",
    },
  ]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateOrder = () => {
    const totalAmount = newOrder.items.reduce((sum, item) => {
      return sum + (parseInt(item.price) || 0) * item.quantity;
    }, 0);

    const orderItems = newOrder.items.map((item) => item.name).join(", ");

    const order = {
      id: (orders.length + 1).toString(),
      customer: newOrder.customer,
      phone: newOrder.phone,
      items: orderItems,
      itemsList: newOrder.items,
      total: `₦${totalAmount.toLocaleString()}`,
      status: newOrder.status,
      date: new Date().toISOString().split("T")[0],
      notes: newOrder.notes,
    };

    setOrders([...orders, order]);
    setNewOrder({
      customer: "",
      phone: "",
      items: [{ name: "", quantity: 1, price: "" }],
      status: "Pending",
      notes: "",
    });
    setCreateDialogOpen(false);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setEditOrder({
      customer: order.customer,
      phone: order.phone,
      items: [...order.itemsList],
      status: order.status,
      notes: order.notes,
      total: order.total,
    });
    setViewDialogOpen(true);
  };

  const handleUpdateOrder = () => {
    const totalAmount = editOrder.items.reduce((sum, item) => {
      return sum + (parseInt(item.price) || 0) * item.quantity;
    }, 0);

    const orderItems = editOrder.items.map((item) => item.name).join(", ");

    const updatedOrders = orders.map((order) => {
      if (order.id === selectedOrder.id) {
        return {
          ...order,
          customer: editOrder.customer,
          phone: editOrder.phone,
          items: orderItems,
          itemsList: editOrder.items,
          total: `₦${totalAmount.toLocaleString()}`,
          status: editOrder.status,
          notes: editOrder.notes,
        };
      }
      return order;
    });

    setOrders(updatedOrders);
    setViewDialogOpen(false);
  };

  const addNewItem = (isEdit = false) => {
    if (isEdit) {
      setEditOrder({
        ...editOrder,
        items: [...editOrder.items, { name: "", quantity: 1, price: "" }],
      });
    } else {
      setNewOrder({
        ...newOrder,
        items: [...newOrder.items, { name: "", quantity: 1, price: "" }],
      });
    }
  };

  const removeItem = (index, isEdit = false) => {
    if (isEdit) {
      const items = editOrder.items.filter((_, i) => i !== index);
      setEditOrder({ ...editOrder, items });
    } else {
      const items = newOrder.items.filter((_, i) => i !== index);
      setNewOrder({ ...newOrder, items });
    }
  };

  const updateItem = (index, field, value, isEdit = false) => {
    if (isEdit) {
      const items = [...editOrder.items];
      items[index] = { ...items[index], [field]: value };
      setEditOrder({ ...editOrder, items });
    } else {
      const items = [...newOrder.items];
      items[index] = { ...items[index], [field]: value };
      setNewOrder({ ...newOrder, items });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Orders</h1>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create Order</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Order</DialogTitle>
              <DialogDescription>
                Add a new order to the system.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="customer">Customer Name</Label>
                  <Input
                    id="customer"
                    value={newOrder.customer}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, customer: e.target.value })
                    }
                    placeholder="Enter customer name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={newOrder.phone}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, phone: e.target.value })
                    }
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Order Items</Label>
                {newOrder.items.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-2 items-end"
                  >
                    <div className="col-span-5">
                      <Input
                        placeholder="Item name"
                        value={item.name}
                        onChange={(e) =>
                          updateItem(index, "name", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "quantity",
                            parseInt(e.target.value) || 1
                          )
                        }
                        min="1"
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        type="number"
                        placeholder="Price (₦)"
                        value={item.price}
                        onChange={(e) =>
                          updateItem(index, "price", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-span-2">
                      {newOrder.items.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(index)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addNewItem()}
                  className="w-fit"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newOrder.status}
                  onValueChange={(value) =>
                    setNewOrder({ ...newOrder, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newOrder.notes}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, notes: e.target.value })
                  }
                  placeholder="Any special instructions..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateOrder}>
                Create Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Processing">Processing</SelectItem>
            <SelectItem value="Delivered">Delivered</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">#{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.items}</TableCell>
                <TableCell>{order.total}</TableCell>
                <TableCell>
                  <div
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                    ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-800"
                        : order.status === "Processing"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.status}
                  </div>
                </TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewOrder(order)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* View/Edit Order Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order #{selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              View and update order details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-customer">Customer Name</Label>
                <Input
                  id="edit-customer"
                  value={editOrder.customer}
                  onChange={(e) =>
                    setEditOrder({ ...editOrder, customer: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Phone Number</Label>
                <Input
                  id="edit-phone"
                  value={editOrder.phone}
                  onChange={(e) =>
                    setEditOrder({ ...editOrder, phone: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Order Items</Label>
              {editOrder.items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-5">
                    <Input
                      placeholder="Item name"
                      value={item.name}
                      onChange={(e) =>
                        updateItem(index, "name", e.target.value, true)
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(
                          index,
                          "quantity",
                          parseInt(e.target.value) || 1,
                          true
                        )
                      }
                      min="1"
                    />
                  </div>
                  <div className="col-span-3">
                    <Input
                      type="number"
                      placeholder="Price (₦)"
                      value={item.price}
                      onChange={(e) =>
                        updateItem(index, "price", e.target.value, true)
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    {editOrder.items.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(index, true)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addNewItem(true)}
                className="w-fit"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={editOrder.status}
                onValueChange={(value) =>
                  setEditOrder({ ...editOrder, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={editOrder.notes}
                onChange={(e) =>
                  setEditOrder({ ...editOrder, notes: e.target.value })
                }
                placeholder="Any special instructions..."
              />
            </div>

            <div className="bg-gray-50 p-3 rounded">
              <div className="text-sm text-gray-600">
                Order Date: {selectedOrder?.date}
              </div>
              <div className="text-lg font-semibold">
                Total: ₦
                {editOrder.items
                  .reduce(
                    (sum, item) =>
                      sum + (parseInt(item.price) || 0) * item.quantity,
                    0
                  )
                  .toLocaleString()}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateOrder}>Update Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

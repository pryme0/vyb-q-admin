"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Edit, Trash2, Loader2, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InventoryForm } from "@/components/inventory/inventory-form";
import { toast } from "sonner";
import {
  useGetInventories,
  useCreateInventory,
  useUpdateInventory,
  useDeleteInventory,
  useGetInventoryMetrics,
} from "@/hooks";
import { InventoryItem, InventoryUnitEnum } from "@/types/inventory";
import { format, subDays } from "date-fns";

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

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem>({
    id: "",
    itemName: "",
    quantity: 0,
    unit: InventoryUnitEnum.KG,
    description: "",
    unitPrice: 0,
  });
  const [page, setPage] = useState(1);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const limit = 10;

  // Date range for metrics
  const [startDate, setStartDate] = useState(
    format(subDays(new Date(), 30), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const {
    data: inventoriesResponse,
    isLoading: isInventoryLoading,
    isError: isInventoryError,
    error: inventoryError,
  } = useGetInventories({
    page: page.toString(),
    limit: limit.toString(),
    search: debouncedSearchQuery,
    queryOptions: {
      refetchInterval: isPageVisible ? 60000 : false,
    },
  });

  const {
    data: metrics,
    isLoading: isMetricsLoading,
    isError: isMetricsError,
    error: metricsError,
  } = useGetInventoryMetrics(
    { startDate, endDate },
    { enabled: !!startDate && !!endDate }
  );

  const inventories = inventoriesResponse?.data || [];
  const total = inventoriesResponse?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const createInventory = useCreateInventory();
  const updateInventory = useUpdateInventory();
  const deleteInventory = useDeleteInventory();

  const [formLoading, setFormLoading] = useState(false);

  // Handle page visibility for refetching
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(document.visibilityState === "visible");
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const handleAddItem = async (data: any) => {
    try {
      setFormLoading(true);
      await createInventory.mutateAsync(data);
      setIsAddDialogOpen(false);
      toast.success("Inventory item added successfully");
    } catch (error) {
      toast.error("Failed to add inventory item");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditItem = async (data: any) => {
    try {
      if (!selectedItem) return;
      setFormLoading(true);
      await updateInventory.mutateAsync({
        id: selectedItem.id || "",
        data,
      });
      setIsEditDialogOpen(false);
      toast.success("Inventory item updated successfully");
    } catch (error) {
      toast.error("Failed to update inventory item");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteItem = async () => {
    try {
      if (!selectedItem) return;
      await deleteInventory.mutateAsync(selectedItem.id);
      setIsDeleteDialogOpen(false);
      toast.success("Inventory item deleted successfully");
    } catch (error) {
      toast.error("Failed to delete inventory item");
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  if (isInventoryError || isMetricsError) {
    return (
      <div className="text-center py-8 text-red-600">
        Failed to load data:{" "}
        {(inventoryError as any)?.message ||
          (metricsError as any)?.message ||
          "Unknown error"}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Inventory</h1>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Inventory
        </Button>
      </div>

      {/* Metrics Section */}
      <div className="border rounded-lg p-4 bg-card">
        <h2 className="text-xl font-semibold mb-4">Inventory Metrics</h2>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="text-sm font-medium text-muted-foreground">
              Start Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-muted-foreground">
              End Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>
        </div>
        {isMetricsLoading ? (
          <div className="text-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 bg-background">
              <h3 className="text-sm font-medium text-muted-foreground">
                Total Inventory Value
              </h3>
              <p className="text-2xl font-bold mt-2">
                ₦{(metrics?.total_inventory_value || 0)}
              </p>
            </div>
            <div className="border rounded-lg p-4 bg-background">
              <h3 className="text-sm font-medium text-muted-foreground">
                Total Variance Cost
              </h3>
              <p className="text-2xl font-bold mt-2">
                ₦{(metrics?.total_variance_cost || 0)}
              </p>
            </div>
            <div className="border rounded-lg p-4 bg-background">
              <h3 className="text-sm font-medium text-muted-foreground">
                Profit/Loss Value
              </h3>
              <p
                className={`text-2xl font-bold mt-2 ${
                  (metrics?.profit_loss_value || 0) >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                ₦{(metrics?.profit_loss_value || 0)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Search and Table */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative w-full sm:min-w-[300px] sm:flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search inventory..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-10 w-full"
          />
        </div>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Item</TableHead>
              <TableHead className="whitespace-nowrap">Quantity</TableHead>
              <TableHead className="whitespace-nowrap">Unit Price</TableHead>
              <TableHead className="whitespace-nowrap">Total Value</TableHead>
              <TableHead className="whitespace-nowrap">Status</TableHead>
              <TableHead className="whitespace-nowrap">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isInventoryLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                </TableCell>
              </TableRow>
            ) : inventories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No inventory items found
                </TableCell>
              </TableRow>
            ) : (
              inventories.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="whitespace-nowrap">
                    <div>
                      <div className="font-medium">{item.itemName}</div>
                      <div className="text-sm text-muted-foreground">
                        #{item.id}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {item.quantity} {item.unit}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    ₦{(item.unitPrice || 0)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    ₦{((item.quantity || 0) * (item.unitPrice || 0))}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                        ${
                          item.status === "active"
                            ? "bg-green-100 text-green-800"
                            : item.status === "low_stock"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                    >
                      {item.status.replace("_", " ").charAt(0).toUpperCase() +
                        item.status.replace("_", " ").slice(1)}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedItem(item);
                          setIsEditDialogOpen(true);
                        }}
                        aria-label={`Edit ${item.itemName}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedItem(item);
                          setIsDeleteDialogOpen(true);
                        }}
                        aria-label={`Delete ${item.itemName}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <p className="text-sm text-muted-foreground">
          Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of{" "}
          {total} items
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
            disabled={page === totalPages || total === 0}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Add Inventory Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Inventory Item</DialogTitle>
            <DialogDescription>
              <InventoryForm
                onSubmit={handleAddItem}
                onCancel={() => setIsAddDialogOpen(false)}
                loading={formLoading}
              />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Edit Inventory Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Inventory Item</DialogTitle>
            <DialogDescription>
              <InventoryForm
                initialData={selectedItem}
                onSubmit={handleEditItem}
                onCancel={() => setIsEditDialogOpen(false)}
                loading={formLoading}
              />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              inventory item "{selectedItem?.itemName}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteItem}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

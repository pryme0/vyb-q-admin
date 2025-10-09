"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Tag as TagIcon,
  Percent,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Power,
  Calendar,
  Clock,
} from "lucide-react";
import {
  useDiscounts,
  useCreateDiscount,
  useUpdateDiscount,
  useDeleteDiscount,
  useToggleDiscount,
  useDebounce,
} from "@/hooks";
import { Discount, DiscountType, DiscountScope } from "@/types";
import { DiscountForm } from "@/components/discounts/discount-form";
import { toast } from "sonner";
import { format } from "date-fns";

export default function DiscountsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "inactive">("all");

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);

  const {
    data,
    isLoading,
    error,
  } = useDiscounts({
    page,
    limit: pageSize,
    search: debouncedSearchQuery,
    isActive: activeFilter === "all" ? undefined : activeFilter === "active",
  });

  const createDiscountMutation = useCreateDiscount();
  const updateDiscountMutation = useUpdateDiscount();
  const deleteDiscountMutation = useDeleteDiscount();
  const toggleDiscountMutation = useToggleDiscount();

  const discounts = data?.data || [];
  const totalItems = data?.total || 0;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalItems);

  const handleAddDiscount = async (formData: any) => {
    try {
      await createDiscountMutation.mutateAsync(formData);
      toast.success("Discount created successfully");
      setIsAddDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create discount");
    }
  };

  const handleEditDiscount = async (formData: any) => {
    if (!selectedDiscount) return;
    try {
      await updateDiscountMutation.mutateAsync({
        id: selectedDiscount.id,
        data: formData,
      });
      toast.success("Discount updated successfully");
      setIsEditDialogOpen(false);
      setSelectedDiscount(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update discount");
    }
  };

  const handleDeleteDiscount = async () => {
    if (!selectedDiscount) return;
    try {
      await deleteDiscountMutation.mutateAsync(selectedDiscount.id);
      toast.success("Discount deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedDiscount(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete discount");
    }
  };

  const handleToggleActive = async (discount: Discount) => {
    try {
      await toggleDiscountMutation.mutateAsync(discount.id);
      toast.success(
        `Discount ${discount.isActive ? "deactivated" : "activated"} successfully`
      );
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to toggle discount");
    }
  };

  const openEditDialog = (discount: Discount) => {
    setSelectedDiscount(discount);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (discount: Discount) => {
    setSelectedDiscount(discount);
    setIsDeleteDialogOpen(true);
  };

  const handlePageSizeChange = (value: string) => {
    setPageSize(parseInt(value));
    setPage(1);
  };

  const handleActiveFilterChange = (value: "all" | "active" | "inactive") => {
    setActiveFilter(value);
    setPage(1);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, page - 1);
      let end = Math.min(totalPages - 1, page + 1);

      if (page <= 3) {
        end = Math.min(totalPages - 1, 4);
      }
      if (page >= totalPages - 2) {
        start = Math.max(2, totalPages - 3);
      }

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("...");
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy 'at' h:mm a");
  };

  const isDiscountExpired = (discount: Discount) => {
    if (!discount.endDate) return false;
    return new Date(discount.endDate) < new Date();
  };

  const isDiscountUpcoming = (discount: Discount) => {
    if (!discount.startDate) return false;
    return new Date(discount.startDate) > new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Discounts</h1>
          <p className="text-gray-500 mt-1">Manage discounts and promotions</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Discount
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search discounts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Active Filter */}
            <Select value={activeFilter} onValueChange={handleActiveFilterChange}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Discounts</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            {/* Page Size */}
            <Select
              value={pageSize.toString()}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="25">25 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Discounts List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isLoading ? (
              "Loading..."
            ) : (
              <>
                Showing {discounts.length > 0 ? startItem : 0} to {endItem} of{" "}
                {totalItems} discounts
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">Error loading discounts</p>
            </div>
          ) : discounts.length === 0 ? (
            <div className="text-center py-12">
              <TagIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No discounts found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {discounts.map((discount) => {
                const isExpired = isDiscountExpired(discount);
                const isUpcoming = isDiscountUpcoming(discount);
                
                return (
                  <Card key={discount.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Discount Info */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">
                                {discount.name}
                              </h3>
                              {discount.description && (
                                <p className="text-sm text-gray-600 mt-1">
                                  {discount.description}
                                </p>
                              )}
                            </div>
                            <div className="flex gap-1 flex-wrap justify-end">
                              {discount.isActive ? (
                                isExpired ? (
                                  <Badge variant="outline" className="bg-red-50">
                                    Expired
                                  </Badge>
                                ) : isUpcoming ? (
                                  <Badge variant="outline" className="bg-blue-50">
                                    Upcoming
                                  </Badge>
                                ) : (
                                  <Badge>Active</Badge>
                                )
                              ) : (
                                <Badge variant="secondary">Inactive</Badge>
                              )}
                              {discount.scope === DiscountScope.ALL_ITEMS && (
                                <Badge variant="outline">All Items</Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            {/* Discount Value */}
                            <div className="flex items-center gap-1">
                              {discount.type === DiscountType.PERCENTAGE ? (
                                <>
                                  <Percent className="w-4 h-4 text-green-600" />
                                  <span className="font-medium text-green-600">
                                    {discount.value}% off
                                  </span>
                                </>
                              ) : (
                                <>
                                  <DollarSign className="w-4 h-4 text-green-600" />
                                  <span className="font-medium text-green-600">
                                    ${discount.value} off
                                  </span>
                                </>
                              )}
                            </div>

                            {/* Menu Items Count */}
                            {discount.scope === DiscountScope.SPECIFIC_ITEMS && (
                              <div className="flex items-center gap-1 text-gray-600">
                                <TagIcon className="w-4 h-4" />
                                <span>
                                  {discount.menuItems?.length || 0} items
                                </span>
                              </div>
                            )}

                            {/* Dates */}
                            {discount.startDate && (
                              <div className="flex items-center gap-1 text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span className="text-xs">
                                  From: {formatDate(discount.startDate)}
                                </span>
                              </div>
                            )}
                            {discount.endDate && (
                              <div className="flex items-center gap-1 text-gray-600">
                                <Clock className="w-4 h-4" />
                                <span className="text-xs">
                                  Until: {formatDate(discount.endDate)}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Menu Items List (for specific items) */}
                          {discount.scope === DiscountScope.SPECIFIC_ITEMS &&
                            discount.menuItems &&
                            discount.menuItems.length > 0 && (
                              <div className="flex flex-wrap gap-1 pt-2">
                                {discount.menuItems.slice(0, 5).map((item) => (
                                  <Badge key={item.id} variant="secondary" className="text-xs">
                                    {item.name}
                                  </Badge>
                                ))}
                                {discount.menuItems.length > 5 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{discount.menuItems.length - 5} more
                                  </Badge>
                                )}
                              </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex sm:flex-col gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleActive(discount)}
                            className="flex-1 sm:flex-initial"
                          >
                            <Power className="w-3 h-3 mr-1" />
                            {discount.isActive ? "Deactivate" : "Activate"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(discount)}
                            className="flex-1 sm:flex-initial"
                          >
                            <Edit2 className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDeleteDialog(discount)}
                            className="flex-1 sm:flex-initial text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          {getPageNumbers().map((pageNumber, index) =>
            pageNumber === "..." ? (
              <span key={`ellipsis-${index}`} className="px-2">
                ...
              </span>
            ) : (
              <Button
                key={pageNumber}
                variant={pageNumber === page ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(pageNumber as number)}
              >
                {pageNumber}
              </Button>
            )
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Add Discount Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Discount</DialogTitle>
            <DialogDescription>
              Create a new discount. Fill in the details below.
            </DialogDescription>
          </DialogHeader>
          <DiscountForm
            onSubmit={handleAddDiscount}
            isLoading={createDiscountMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Discount Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Discount</DialogTitle>
            <DialogDescription>
              Update the discount details below.
            </DialogDescription>
          </DialogHeader>
          <DiscountForm
            discount={selectedDiscount}
            onSubmit={handleEditDiscount}
            isLoading={updateDiscountMutation.isPending}
          />
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
              discount &quot;{selectedDiscount?.name}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedDiscount(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteDiscount}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteDiscountMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}


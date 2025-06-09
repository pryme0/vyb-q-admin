"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useCustomers, useUpdateCustomer, useDebounce } from "@/hooks";
import { toast } from "sonner";

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500); // Debounce for 500ms

  const [page, setPage] = useState(1);
  const limit = 10;

  const {
    data: paginatedCustomers,
    isLoading,
    isError,
    error,
  } = useCustomers({ page, limit, search: debouncedSearchQuery });

  const customers = paginatedCustomers?.data || [];
  const totalPages = Math.ceil((paginatedCustomers?.total || 0) / limit);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [editCustomer, setEditCustomer] = useState<any>(null);

  const updateCustomerMutation = useUpdateCustomer();

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const handleViewCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setEditCustomer({
      fullName: customer.fullName || "",
      phoneNumber: customer.phoneNumber || "",
      addresses: customer.addresses ? [...customer.addresses] : [""],
    });
    setIsDialogOpen(true);
  };

  const handleEditChange = (field: string, value: any) => {
    setEditCustomer((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (index: number, value: string) => {
    setEditCustomer((prev: any) => {
      const updatedAddresses = [...prev.addresses];
      updatedAddresses[index] = value;
      return { ...prev, addresses: updatedAddresses };
    });
  };

  const handleAddAddress = () => {
    setEditCustomer((prev: any) => ({
      ...prev,
      addresses: [...prev.addresses, ""],
    }));
  };

  const handleRemoveAddress = (index: number) => {
    setEditCustomer((prev: any) => {
      const updatedAddresses = prev.addresses.filter(
        (_: any, i: number) => i !== index
      );
      return { ...prev, addresses: updatedAddresses };
    });
  };

  const handleSaveCustomer = async () => {
    try {
      await updateCustomerMutation.mutateAsync({
        id: selectedCustomer.id,
        ...editCustomer,
      });
      toast.success("Customer updated successfully!");
      setIsDialogOpen(false);
    } catch (err) {
      toast.error("Error updating customer");
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 md:p-8 w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Customers</h1>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Content */}
      <Card className="border rounded-lg overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              Loading customers...
            </div>
          ) : isError ? (
            <div className="p-4 text-center text-red-500">
              Error loading customers: {(error as any).message}
            </div>
          ) : customers.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No customers found.
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Phone
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Orders
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Created At
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="hover:bg-gray-50 text-sm sm:text-base"
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium text-xs sm:text-sm">
                              {getInitials(customer.fullName)}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {customer.fullName}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500">
                              #{customer.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-gray-900">
                        {customer.email}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-gray-900">
                        {customer.phoneNumber}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-gray-900">
                        {customer.orders?.length || 0}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-gray-900">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewCustomer(customer)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNumber) => (
              <Button
                key={pageNumber}
                variant={pageNumber === page ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(pageNumber)}
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

      {/* View/Edit Customer Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Customer Details</DialogTitle>
            <DialogDescription>
              Update the customer information below.
            </DialogDescription>
          </DialogHeader>
          {editCustomer && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={editCustomer.fullName}
                  onChange={(e) => handleEditChange("fullName", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  value={editCustomer.phoneNumber}
                  onChange={(e) =>
                    handleEditChange("phoneNumber", e.target.value)
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Addresses</Label>
                {editCustomer.addresses.map(
                  (address: string, index: number) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input
                        value={address}
                        onChange={(e) =>
                          handleAddressChange(index, e.target.value)
                        }
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveAddress(index)}
                      >
                        ✕
                      </Button>
                    </div>
                  )
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddAddress}
                  className="mt-2"
                >
                  Add Address
                </Button>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveCustomer}
              disabled={!editCustomer?.fullName || !editCustomer?.phoneNumber}
              loading={updateCustomerMutation.isPending}
            >
              {updateCustomerMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

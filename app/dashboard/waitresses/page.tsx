"use client";

import { useState } from "react";
import { Plus, Search, Edit, Trash2, UserCheck } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WaitressForm } from "@/components/waitress/waitress-form";
import {
  useWaitresses,
  useCreateWaitress,
  useUpdateWaitress,
  useDeleteWaitress,
  useDebounce,
} from "@/hooks";
import type { Waitress } from "@/types";
import { toast } from "sonner";

export default function WaitressesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingWaitress, setEditingWaitress] = useState<Waitress | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useWaitresses(page, 10, debouncedSearch);
  const createMutation = useCreateWaitress();
  const updateMutation = useUpdateWaitress();
  const deleteMutation = useDeleteWaitress();

  const handleCreate = async (formData: any) => {
    try {
      await createMutation.mutateAsync(formData);
      toast.success("Waitress created successfully");
      setIsCreateOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create waitress");
    }
  };

  const handleUpdate = async (formData: any) => {
    if (!editingWaitress) return;

    try {
      await updateMutation.mutateAsync({
        id: editingWaitress.id,
        data: formData,
      });
      toast.success("Waitress updated successfully");
      setEditingWaitress(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update waitress");
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      await deleteMutation.mutateAsync(deletingId);
      toast.success("Waitress deleted successfully");
      setDeletingId(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete waitress");
    }
  };

  const waitresses = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / 10);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <UserCheck className="h-8 w-8" />
            Waitresses
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage waitresses and cashiers
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Waitress
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Waitresses</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Waitresses</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {waitresses.filter((w) => w.role === "waitress").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cashiers</CardTitle>
            <UserCheck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {waitresses.filter((w) => w.role === "cashier").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card>
        <CardHeader>
          <CardTitle>Search Waitresses</CardTitle>
          <CardDescription>
            Search by name, email, or waitress ID
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search waitresses..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Waitresses Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Waitresses</CardTitle>
          <CardDescription>
            View and manage all waitresses and cashiers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-10">Loading waitresses...</div>
          ) : waitresses.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No waitresses found
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Waitress ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {waitresses.map((waitress) => (
                      <TableRow key={waitress.id}>
                        <TableCell className="font-mono text-xs">
                          {waitress.waitressId}
                        </TableCell>
                        <TableCell className="font-medium">
                          {waitress.fullName}
                        </TableCell>
                        <TableCell>{waitress.email}</TableCell>
                        <TableCell>
                          {waitress.phoneNumber || "N/A"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              waitress.role === "cashier"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {waitress.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(waitress.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingWaitress(waitress)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeletingId(waitress.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {(page - 1) * 10 + 1} to{" "}
                    {Math.min(page * 10, total)} of {total} waitresses
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
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Waitress</DialogTitle>
            <DialogDescription>
              Create a new waitress or cashier account
            </DialogDescription>
          </DialogHeader>
          <WaitressForm
            onSubmit={handleCreate}
            onCancel={() => setIsCreateOpen(false)}
            isLoading={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingWaitress}
        onOpenChange={() => setEditingWaitress(null)}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Waitress</DialogTitle>
            <DialogDescription>
              Update waitress information
            </DialogDescription>
          </DialogHeader>
          <WaitressForm
            initialData={editingWaitress}
            onSubmit={handleUpdate}
            onCancel={() => setEditingWaitress(null)}
            isLoading={updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              waitress account.
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


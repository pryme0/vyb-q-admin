import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axiosBase from "@/lib/axios.base";
import { InventoryItem, PaginationQueryDto } from "@/types";

export function useGetInventories(params: PaginationQueryDto) {
  return useQuery<{ data: InventoryItem[]; total: number }>({
    queryKey: ["inventories", params],
    queryFn: async () => {
      const response = await axiosBase.get("/inventory", {
        params,
      });
      return response.data;
    },
  });
}

export function useCreateInventory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newItem: Omit<InventoryItem, "id">) => {
      const response = await axiosBase.post("/inventory", newItem);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
      toast.success("Inventory item created successfully");
    },
    onError: () => {
      toast.error("Failed to create inventory item");
    },
  });
}

// Update an inventory item
export function useUpdateInventory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updateData: {
      id: string;
      data: Partial<InventoryItem>;
    }) => {
      const response = await axiosBase.patch(
        `/inventory/${updateData.id}`,
        updateData.data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
      toast.success("Inventory item updated successfully");
    },
    onError: () => {
      toast.error("Failed to update inventory item");
    },
  });
}

// Delete an inventory item
export function useDeleteInventory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axiosBase.delete(`/inventory/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
      toast.success("Inventory item deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete inventory item");
    },
  });
}

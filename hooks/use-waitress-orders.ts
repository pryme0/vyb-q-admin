import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosBase from "@/lib/axios.base";
import type {
  WaitressOrder,
  WaitressOrderResponse,
  WaitressOrderQueryParams,
  UpdateWaitressOrderDto,
} from "@/types";

// Get all waitress orders (Admin)
export function useWaitressOrders(params?: WaitressOrderQueryParams) {
  return useQuery<WaitressOrderResponse>({
    queryKey: ["waitress-orders", params],
    queryFn: async () => {
      const response = await axiosBase.get("/waitress-orders", { params });
      return response.data;
    },
  });
}

// Get single waitress order
export function useWaitressOrder(id: string) {
  return useQuery<WaitressOrder>({
    queryKey: ["waitress-order", id],
    queryFn: async () => {
      const response = await axiosBase.get(`/waitress-orders/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

// Update waitress order (status or other fields)
export function useUpdateWaitressOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateWaitressOrderDto }) => {
      const response = await axiosBase.patch(`/waitress-orders/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["waitress-orders"] });
      queryClient.invalidateQueries({ queryKey: ["waitress-order", variables.id] });
    },
  });
}

// Update order name
export function useUpdateOrderName() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const response = await axiosBase.patch(`/waitress-orders/my-orders/${id}/name`, { name });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["waitress-orders"] });
      queryClient.invalidateQueries({ queryKey: ["waitress-order", variables.id] });
    },
  });
}

// Remove items from order
export function useRemoveOrderItems() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, orderItemIds }: { id: string; orderItemIds: string[] }) => {
      const response = await axiosBase.delete(`/waitress-orders/${id}/items`, {
        data: { orderItemIds },
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["waitress-orders"] });
      queryClient.invalidateQueries({ queryKey: ["waitress-order", variables.id] });
    },
  });
}

// Delete waitress order
export function useDeleteWaitressOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosBase.delete(`/waitress-orders/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waitress-orders"] });
    },
  });
}

// Close/Reopen order (convenience wrapper)
export function useToggleOrderStatus() {
  const updateOrder = useUpdateWaitressOrder();
  
  return {
    closeOrder: (id: string) => updateOrder.mutateAsync({ id, data: { status: "closed" } }),
    reopenOrder: (id: string) => updateOrder.mutateAsync({ id, data: { status: "open" } }),
    ...updateOrder,
  };
}

// Generate waitress order report (Admin)
export function useGenerateOrderReport() {
  return useMutation({
    mutationFn: async (data: {
      startDate: string;
      endDate: string;
      email?: string;
    }) => {
      const response = await axiosBase.post("/waitress-orders/admin/generate-report", data);
      return response.data;
    },
  });
}


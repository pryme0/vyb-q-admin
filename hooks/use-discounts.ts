import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosBase from "@/lib/axios.base";
import {
  Discount,
  PaginatedDiscountsResponse,
  BestDiscountResponse,
  DiscountScope,
} from "@/types";

interface UseDiscountsParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  scope?: DiscountScope;
}

// Get all discounts with pagination
export const useDiscounts = ({
  page = 1,
  limit = 10,
  search = "",
  isActive,
  scope,
}: UseDiscountsParams = {}) => {
  return useQuery({
    queryKey: ["discounts", page, limit, search, isActive, scope],
    queryFn: async (): Promise<PaginatedDiscountsResponse> => {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      if (search) params.append("search", search);
      if (isActive !== undefined) params.append("isActive", isActive.toString());
      if (scope) params.append("scope", scope);

      const response = await axiosBase.get(`/discounts?${params.toString()}`);
      return response.data;
    },
  });
};

// Get active discounts
export const useActiveDiscounts = ({
  page = 1,
  limit = 10,
}: Omit<UseDiscountsParams, "isActive" | "scope" | "search"> = {}) => {
  return useQuery({
    queryKey: ["discounts", "active", page, limit],
    queryFn: async (): Promise<PaginatedDiscountsResponse> => {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      const response = await axiosBase.get(`/discounts/active?${params.toString()}`);
      return response.data;
    },
  });
};

// Get single discount
export const useDiscount = (id: string) => {
  return useQuery({
    queryKey: ["discounts", id],
    queryFn: async (): Promise<Discount> => {
      const response = await axiosBase.get(`/discounts/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

// Get active discounts for a menu item
export const useMenuItemDiscounts = (menuItemId: string) => {
  return useQuery({
    queryKey: ["discounts", "menu-item", menuItemId],
    queryFn: async (): Promise<Discount[]> => {
      const response = await axiosBase.get(`/discounts/menu-item/${menuItemId}`);
      return response.data;
    },
    enabled: !!menuItemId,
  });
};

// Get best discount for a menu item
export const useBestDiscount = (menuItemId: string) => {
  return useQuery({
    queryKey: ["discounts", "menu-item", menuItemId, "best"],
    queryFn: async (): Promise<BestDiscountResponse> => {
      const response = await axiosBase.get(`/discounts/menu-item/${menuItemId}/best`);
      return response.data;
    },
    enabled: !!menuItemId,
  });
};

// Create discount
export const useCreateDiscount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: any) => {
      const response = await axiosBase.post("/discounts", input);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
    },
  });
};

// Update discount
export const useUpdateDiscount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await axiosBase.patch(`/discounts/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
    },
  });
};

// Toggle discount active status
export const useToggleDiscount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosBase.patch(`/discounts/${id}/toggle`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
    },
  });
};

// Delete discount
export const useDeleteDiscount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axiosBase.delete(`/discounts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
    },
  });
};

// Add menu items to discount
export const useAddMenuItemsToDiscount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, menuItemIds }: { id: string; menuItemIds: string[] }) => {
      const response = await axiosBase.post(`/discounts/${id}/menu-items`, {
        menuItemIds,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
    },
  });
};

// Add all menu items to discount
export const useAddAllMenuItemsToDiscount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosBase.post(`/discounts/${id}/menu-items/all`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
    },
  });
};

// Remove menu items from discount
export const useRemoveMenuItemsFromDiscount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, menuItemIds }: { id: string; menuItemIds: string[] }) => {
      const response = await axiosBase.delete(`/discounts/${id}/menu-items`, {
        data: { menuItemIds },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
    },
  });
};

// Remove all menu items from discount
export const useRemoveAllMenuItemsFromDiscount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosBase.delete(`/discounts/${id}/menu-items/all`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
    },
  });
};


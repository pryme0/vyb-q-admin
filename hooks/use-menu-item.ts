import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosBase from "@/lib/axios.base";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  categoryId: string;
  image?: File | undefined;
  recipes?: Array<{
    id?: string;
    inventoryId: string;
    quantity: string;
    unit?: string;
    inventory?: {
      id: string;
      itemName: string;
      unit: string;
    };
  }>;
  cost?: number;
  isAvailable?: boolean;
  category?: {
    id: string;
    name: string;
  };
}

export const useMenuItems = (
  page: number,
  limit: number = 10,
  categoryId?: string,
  search?: string
) => {
  return useQuery({
    queryKey: ["menuItems", page, categoryId, search],
    queryFn: async (): Promise<{ data: MenuItem[]; total: number }> => {
      // Build query params
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      if (categoryId) params.append("categoryId", categoryId);
      if (search) params.append("search", search);

      const response = await axiosBase.get(`/menu-items?${params.toString()}`);

      return response.data;
    },
  });
};

// Create a new menu item
export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: FormData | any) => {
      let payload = input;

      // If it's not FormData, convert it
      if (!(input instanceof FormData)) {
        payload = new FormData();
        payload.append("name", input.name);
        payload.append("description", input.description);
        payload.append("price", input.price.toString());
        payload.append("categoryId", input.categoryId);

        if (input.image && input.image[0]) {
          payload.append("image", input.image[0]);
        }
      }

      const response = await axiosBase.post("/menu-items", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
    },
  });
};

// Update an existing menu item
export const useUpdateMenuItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    // Accept id and data separately
    mutationFn: async ({ id, data }: { id: string; data: FormData | any }) => {
      let payload: FormData;

      if (data instanceof FormData) {
        payload = data;
      } else {
        // If not already FormData, convert it
        payload = new FormData();
        payload.append("name", data.name);
        payload.append("description", data.description);
        payload.append("price", data.price.toString());
        payload.append("categoryId", data.categoryId);
        payload.append("isAvailable", data.isAvailable);

        if (data.image && data.image[0]) {
          payload.append("image", data.image[0]);
        }
      }

      const response = await axiosBase.patch(`/menu-items/${id}`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
    },
  });
};

// Delete a menu item
export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axiosBase.delete(`/menu-items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
    },
  });
};

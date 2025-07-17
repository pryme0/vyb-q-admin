import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosBase from "@/lib/axios.base";

export interface CategoryItem {
  id: string;
  name: string;
  createdAt: string;
  updatedA: string;
}

// Fetch paginated menu items
export const useCategories = (limit: number, cursor: string) => {
  return useQuery({
    queryKey: ["categories", cursor],
    queryFn: async (): Promise<{
      data: CategoryItem[];
      meta: {
        totalCount: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        nextCursor: string;
        previousCursor: string;
      };
    }> => {
      const response = await axiosBase.get(
        `/categories?limit=${limit}&cursor=${cursor}`
      );

      return response.data;
    },
  });
};

export const useSubCategories = (limit: number, cursor: string) => {
  return useQuery({
    queryKey: ["sub-categories", cursor],
    queryFn: async (): Promise<{
      data: CategoryItem[];
      meta: {
        totalCount: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        nextCursor: string;
        previousCursor: string;
      };
    }> => {
      const response = await axiosBase.get(
        `/categories/subcategories?limit=${limit}&cursor=${cursor}`
      );

      return response.data;
    },
  });
};

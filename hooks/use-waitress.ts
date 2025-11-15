import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosBase from "@/lib/axios.base";
import type {
  Waitress,
  CreateWaitressDto,
  UpdateWaitressDto,
  WaitressResponse,
} from "@/types";

// Get all waitresses
export function useWaitresses(
  page: number = 1,
  limit: number = 10,
  search?: string
) {
  return useQuery<WaitressResponse>({
    queryKey: ["waitresses", page, limit, search],
    queryFn: async () => {
      const params: any = { page, limit };
      if (search) params.search = search;
      
      const response = await axiosBase.get("/waitress", { params });
      return response.data;
    },
  });
}

// Get single waitress by ID
export function useWaitress(id: string) {
  return useQuery<Waitress>({
    queryKey: ["waitress", id],
    queryFn: async () => {
      const response = await axiosBase.get(`/waitress/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

// Create waitress
export function useCreateWaitress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateWaitressDto) => {
      const response = await axiosBase.post("/auth/waitress/signup", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waitresses"] });
    },
  });
}

// Update waitress
export function useUpdateWaitress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateWaitressDto }) => {
      const response = await axiosBase.patch(`/waitress/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["waitresses"] });
      queryClient.invalidateQueries({ queryKey: ["waitress", variables.id] });
    },
  });
}

// Delete waitress
export function useDeleteWaitress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosBase.delete(`/waitress/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waitresses"] });
    },
  });
}


import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosBase from "@/lib/axios.base";

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  orders?: any[];
  createdAt: string;
  updatedAt: string;
}

interface NewCustomer {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

interface UpdateCustomer {
  id: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
}

interface PaginatedCustomers {
  data: Customer[];
  total: number;
  page: number;
  limit: number;
}

interface FetchCustomersParams {
  page?: number;
  limit?: number;
  search?: string;
}

// Fetch customers with pagination and search
export function useCustomers({
  page = 1,
  limit = 10,
  search = "",
}: FetchCustomersParams) {
  return useQuery<PaginatedCustomers>({
    queryKey: ["customers", page, limit, search],
    queryFn: async () => {
      console.log({ search });
      const response = await axiosBase.get("/customers", {
        params: { page, limit, search },
      });
      return response.data;
    },
  });
}

// Add a new customer
export function useAddCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newCustomer: NewCustomer) => {
      const response = await axiosBase.post("/customers", newCustomer);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
}

// Update a customer
export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updatedCustomer: UpdateCustomer) => {
      const response = await axiosBase.patch(
        `/customers/${updatedCustomer.id}`,
        updatedCustomer
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
}

// Delete a customer
export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (customerId: string) => {
      await axiosBase.delete(`/customers/${customerId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
}

import axiosBase from "@/lib/axios.base";
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";

export interface ReservationItem {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  date: string;
  time: string;
  guests: number;
  notes?: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface CreateReservationInput {
  name: string;
  email: string;
  phoneNumber: string;
  date: string;
  time: string;
  guests: number;
  notes?: string;
}

export interface UpdateReservationInput {
  status: "pending" | "confirmed" | "cancelled";
}

export interface ReservationsPaginateOptions {
  page: number;
  limit: number;
  startDate?: string;
  endDate?: string;
  email?: string;
  options?: any;
}

export const useReservations = (
  page: number,
  limit: number = 10,
  startDate?: string,
  endDate?: string,
  email?: string,
  search?: string,
  status?: string,
  options?: Partial<UseQueryOptions<{ data: ReservationItem[]; total: number }>>
) => {
  return useQuery({
    queryKey: [
      "reservations",
      page,
      limit,
      startDate,
      endDate,
      email,
      search,
      status,
    ],
    queryFn: async (): Promise<{ data: ReservationItem[]; total: number }> => {
      // Build query params
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      if (email) params.append("email", email);
      if (search) params.append("search", search);
      if (status) params.append("status", status);

      const response = await axiosBase.get(
        `/reservations?${params.toString()}`
      );
      return response.data;
    },
    ...options,
  });
};

export const useReservation = (id?: string) => {
  return useQuery({
    queryKey: ["reservation", id],
    enabled: !!id,
    queryFn: async (): Promise<ReservationItem> => {
      const response = await axiosBase.get(`/reservations/${id}`);
      return response.data;
    },
  });
};

export const useCreateReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      input: CreateReservationInput
    ): Promise<ReservationItem> => {
      const response = await axiosBase.post("/reservations", input);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate reservations list to refresh
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
    onError: (error: any) => {
      // Handle specific error messages from API
      const message =
        error.response?.data?.message || "Failed to create reservation";
      throw new Error(message);
    },
  });
};

export const useUpdateReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: UpdateReservationInput;
    }): Promise<ReservationItem> => {
      const response = await axiosBase.patch(`/reservations/${id}`, input);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to update reservation";
      throw new Error(message);
    },
  });
};

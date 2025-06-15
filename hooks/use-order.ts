import axiosBase from "@/lib/axios.base";
import { UseOrdersParams, OrdersResponse, Order } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface UpdateOrderDto {
  status?: string;
  notes?: string;
}

export const useOrders = ({ limit, page, queryOptions }: UseOrdersParams) => {
  return useQuery({
    queryKey: ["orders", page],
    queryFn: async (): Promise<OrdersResponse> => {
      const queryParams = new URLSearchParams();
      queryParams.append("limit", limit.toString());
      queryParams.append("page", page.toString());

      const response = await axiosBase.get(`/orders?${queryParams.toString()}`);
      return response.data;
    },
    enabled: !!page,
    ...queryOptions,
  });
};

export function useOrderDetails(id: string) {
  return useQuery<Order>({
    queryKey: ["order", id],
    queryFn: async () => {
      const response = await axiosBase.get(`/orders/${id}`);
      console.log({ response });
      return response.data;
    },
    enabled: !!id,
  });
}

export function useUpdateOrder() {
  const qc = useQueryClient();

  return useMutation<Order, Error, { orderId: string; dto: UpdateOrderDto }>({
    mutationFn: ({ orderId, dto }) =>
      axiosBase.patch(`/orders/${orderId}`, dto).then((r) => r.data),
    onSuccess: (data, variables) => {
      const { orderId } = variables;
      qc.invalidateQueries({ queryKey: ["order", orderId] });
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

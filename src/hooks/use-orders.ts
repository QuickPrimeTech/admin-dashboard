// hooks/use-orders.ts
import { ApiResponse } from "@/types/api";
import { OrderDB, OrderStatus } from "@/types/order";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

export const getOrdersQueryKey = (branchId: string) => ["orders", branchId];

export function useOrders(branchId: string) {
  return useQuery<OrderDB[], AxiosError<ApiResponse<null>>>({
    queryKey: getOrdersQueryKey(branchId),
    queryFn: async () => {
      const res = await axios.get<ApiResponse<OrderDB[]>>("/api/orders");
      return res.data.data;
    },
    enabled: !!branchId,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000,
  });
}

interface UpdateOrderVariables {
  orderId: string;
  newStatus: OrderStatus;
}

export function useUpdateOrderMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ApiResponse<null>>, UpdateOrderVariables>(
    {
      mutationFn: async ({ orderId, newStatus }) => {
        await axios.patch(`/api/orders/${orderId}`, {
          order_status: newStatus,
        });
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({
          queryKey: getOrdersQueryKey(variables.orderId),
        });
      },
    },
  );
}

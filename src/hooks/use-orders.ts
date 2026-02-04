// hooks/use-orders.ts
import { ApiResponse } from "@/types/api";
import { OrderDB, OrderStatus } from "@/types/order";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

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

export function useUpdateOrderMutation(branchId: string) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<{ status: OrderStatus }>,
    AxiosError<ApiResponse<null>>,
    UpdateOrderVariables,
    { previousOrders: OrderDB[] | undefined }
  >({
    mutationFn: async ({ orderId, newStatus }) => {
      const res = await axios.patch<ApiResponse<{ status: OrderStatus }>>(
        `/api/orders/${orderId}`,
        {
          order_status: newStatus,
        },
      );
      return res.data;
    },
    onMutate: async ({ newStatus, orderId }) => {
      const queryKey = getOrdersQueryKey(branchId);

      //Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      //Take a snapshot of all the previous orders
      const previousOrders = queryClient.getQueryData<OrderDB[]>(queryKey);
      //Optimistically update the cache
      queryClient.setQueryData<OrderDB[]>(queryKey, (oldOrders) => {
        if (!oldOrders) return oldOrders;
        return oldOrders.map((order) =>
          order.id === orderId ? { ...order, order_status: newStatus } : order,
        );
      });

      return { previousOrders };
    },
    onError: (error, { newStatus }, context) => {
      const queryKey = getOrdersQueryKey(branchId);
      if (context?.previousOrders) {
        queryClient.setQueryData(queryKey, context.previousOrders);
      }
      toast.error(
        error.response?.data.message ||
          `Something went wrong while updating the status to ${newStatus}`,
      );
    },
    onSuccess: (res, variables) => {
      toast.success(
        res.message ||
          `The customer has been notified that their order is ${variables.newStatus}`,
      );
    },
  });
}

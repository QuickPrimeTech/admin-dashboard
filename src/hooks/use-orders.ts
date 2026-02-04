// hooks/use-orders.ts
import { ApiResponse } from "@/types/api";
import { OrderItem } from "@/types/order";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

export const getOrdersQueryKey = (branchId: string) => ["orders", branchId];

//Doing the fetching logic and all the orders from the db
export function useOrders(branchId: string) {
  return useQuery<OrderItem[], AxiosError<ApiResponse<null>>>({
    queryKey: getOrdersQueryKey(branchId),
    queryFn: async () => {
      const res = await axios.get("/api/orders");
      return res.data.data;
    },
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useUpdateOrderMutation() {}

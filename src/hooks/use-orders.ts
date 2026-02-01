// hooks/use-orders.ts
"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { transformOrders, transformOrder } from "@/lib/orders/transform";
import { OrderUI, OrderStatus } from "@/types/order";

interface UseOrdersOptions {
  branchId: string;
}

const supabase = createClient();

export function useOrders({ branchId }: UseOrdersOptions) {
  const queryClient = useQueryClient();
  const queryKey = ["orders", branchId];

  const {
    data: orders = [],
    isLoading,
    error,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("branch_id", branchId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return transformOrders(data || []);
    },
    staleTime: 1000 * 30,
  });

  useEffect(() => {
    if (!branchId) return;

    const channel = supabase
      .channel(`orders:${branchId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `branch_id=eq.${branchId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newOrder = transformOrder(payload.new as any);
            queryClient.setQueryData<OrderUI[]>(queryKey, (old = []) => {
              if (old.find((o) => o.id === newOrder.id)) return old;
              return [newOrder, ...old];
            });

            if (Notification?.permission === "granted") {
              new Notification("New Order!", {
                body: `${newOrder.customerName} - $${newOrder.total.toFixed(2)}`,
                icon: "/icon.png",
              });
            }
          } else if (payload.eventType === "UPDATE") {
            const updatedOrder = transformOrder(payload.new as any);
            queryClient.setQueryData<OrderUI[]>(queryKey, (old = []) => {
              return old.map((order) =>
                order.id === updatedOrder.id ? updatedOrder : order,
              );
            });
          } else if (payload.eventType === "DELETE") {
            queryClient.setQueryData<OrderUI[]>(queryKey, (old = []) => {
              return old.filter((order) => order.id !== payload.old.id);
            });
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [branchId, queryClient, queryKey]);

  const updateStatus = useMutation({
    mutationFn: async ({
      orderId,
      newStatus,
    }: {
      orderId: string;
      newStatus: OrderStatus;
    }) => {
      const dbStatus = newStatus === "new" ? "pending" : newStatus;

      const { data, error } = await supabase
        .from("orders")
        .update({ status: dbStatus })
        .eq("id", orderId)
        .select()
        .single();

      if (error) throw error;
      return transformOrder(data);
    },
    onMutate: async ({ orderId, newStatus }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousOrders = queryClient.getQueryData<OrderUI[]>(queryKey);

      queryClient.setQueryData<OrderUI[]>(queryKey, (old = []) => {
        return old.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus,
                completedAt:
                  newStatus === "completed" ? new Date() : order.completedAt,
              }
            : order,
        );
      });

      return { previousOrders };
    },
    onError: (err, variables, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(queryKey, context.previousOrders);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    orders,
    isLoading,
    error,
    updateStatus: updateStatus.mutate,
    isUpdating: updateStatus.isPending,
  };
}

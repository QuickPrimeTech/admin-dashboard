// app/dashboard/orders/page.tsx
"use client";
import { useState, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarClock, Clock, History, Loader2 } from "lucide-react";
import { StatsBar } from "@/sections/orders/stats-bar";
import { OrderColumn } from "@/sections/orders/order-column";
import { PastOrdersSection } from "@/sections/orders/past-orders-section";
import { ScheduledOrdersSection } from "@/sections/orders/scheduled-orders-section";
import { OrderDetailsSheet } from "@/sections/orders/order-details-sheet";
import { useOrders, useUpdateOrderMutation } from "@/hooks/use-orders";
import { OrderStatus, OrderViewModel } from "@/types/order";
import {
  isToday,
  startOfDay,
  endOfDay,
  parseISO,
  isBefore,
  isAfter,
} from "date-fns";
import { useBranch } from "@/components/providers/branch-provider";

export default function OrdersDashboard() {
  const [selectedOrder, setSelectedOrder] = useState<OrderViewModel | null>(
    null,
  );
  const [sheetOpen, setSheetOpen] = useState(false);
  const [orderTypeFilter, setOrderTypeFilter] = useState<
    "all" | "pickup" | "delivery"
  >("all");
  const [viewMode, setViewMode] = useState<"today" | "scheduled" | "history">(
    "today",
  );

  const { branchId } = useBranch();
  const { data: orders = [], isLoading, error } = useOrders(branchId);
  const updateMutation = useUpdateOrderMutation(branchId);

  const viewModels = useMemo((): OrderViewModel[] => {
    return orders.map((order) => {
      const scheduledFor =
        order.pickup_date && order.pickup_time
          ? parseISO(`${order.pickup_date}T${order.pickup_time}`)
          : order.delivery_date && order.delivery_time
            ? parseISO(`${order.delivery_date}T${order.delivery_time}`)
            : null;

      return {
        id: order.id,
        orderNumber: `#${order.id.slice(-6).toUpperCase()}`,
        customerName: order.name,
        email: order.email,
        phone: order.phone,
        type: order.delivery_address ? "delivery" : "pickup",
        status: order.order_status || "new",
        priority: scheduledFor ? "scheduled" : "normal",
        items: order.items,
        total: Number(order.total),
        deliveryAddress: order.delivery_address,
        specialInstructions: order.special_instructions,
        createdAt: parseISO(order.created_at),
        scheduledFor,
        completedAt: null,
        branchId: order.branch_id,
        paymentMethod: order.payment_method,
        raw: order,
      };
    });
  }, [orders]);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateMutation.mutate({ orderId, newStatus });
  };

  const handleViewDetails = (order: OrderViewModel) => {
    setSelectedOrder(order);
    setSheetOpen(true);
  };

  const typeFilteredOrders = useMemo(() => {
    if (orderTypeFilter === "all") return viewModels;
    return viewModels.filter((order) => order.type === orderTypeFilter);
  }, [viewModels, orderTypeFilter]);

  // TODAY ORDERS: Due today, sorted by scheduled time (nearest first)
  const todayOrders = useMemo(() => {
    const now = new Date();
    return typeFilteredOrders
      .filter((o) => {
        // Must be scheduled and due today
        if (!o.scheduledFor) return false;
        return isToday(o.scheduledFor) && o.status !== "completed";
      })
      .sort((a, b) => {
        const timeA = a.scheduledFor!.getTime();
        const timeB = b.scheduledFor!.getTime();

        // Overdue orders (before now) go to top
        const aIsOverdue = isBefore(a.scheduledFor!, now);
        const bIsOverdue = isBefore(b.scheduledFor!, now);

        if (aIsOverdue && !bIsOverdue) return -1;
        if (!aIsOverdue && bIsOverdue) return 1;

        // Both overdue or both upcoming: sort by time (nearest first)
        return timeA - timeB;
      });
  }, [typeFilteredOrders]);

  // UPCOMING SCHEDULED: Future dates (not today), sorted by date
  const upcomingScheduledOrders = useMemo(() => {
    return typeFilteredOrders
      .filter((o) => {
        if (!o.scheduledFor) return false;
        return (
          !isToday(o.scheduledFor) &&
          isAfter(o.scheduledFor, new Date()) &&
          o.status !== "completed"
        );
      })
      .sort((a, b) => a.scheduledFor!.getTime() - b.scheduledFor!.getTime());
  }, [typeFilteredOrders]);

  const completedOrders = useMemo(() => {
    return typeFilteredOrders
      .filter((o) => o.status === "completed")
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [typeFilteredOrders]);

  // Split today orders by status for columns
  const newOrders = todayOrders.filter((o) => o.status === "new");
  const preparingOrders = todayOrders.filter((o) => o.status === "preparing");
  const readyOrders = todayOrders.filter((o) => o.status === "ready");

  const stats = useMemo(() => {
    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);

    const activeToday = todayOrders.length;
    const overdueToday = todayOrders.filter(
      (o) => o.scheduledFor && isBefore(o.scheduledFor, now),
    ).length;

    const completedToday = typeFilteredOrders.filter(
      (o) =>
        o.status === "completed" &&
        o.completedAt &&
        o.completedAt >= todayStart &&
        o.completedAt <= todayEnd,
    ).length;

    const totalRevenue = typeFilteredOrders
      .filter((o) => o.status === "completed" && isToday(o.createdAt))
      .reduce((sum, o) => sum + o.total, 0);

    return {
      activeToday,
      overdueToday,
      completedToday,
      totalRevenue,
    };
  }, [todayOrders, typeFilteredOrders]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive font-medium">Failed to load orders</p>
          <p className="text-sm text-muted-foreground mt-1">
            {error.response?.data?.message || error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main>
        <div className="container mx-auto space-y-6">
          <StatsBar
            activeToday={stats.activeToday}
            overdueToday={stats.overdueToday}
            completedToday={stats.completedToday}
            totalRevenue={stats.totalRevenue}
          />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Tabs
              value={viewMode}
              onValueChange={(v) => setViewMode(v as typeof viewMode)}
            >
              <TabsList className="h-11">
                <TabsTrigger value="today" className="gap-2 px-4">
                  <Clock className="h-4 w-4" />
                  Today
                  {todayOrders.length > 0 && (
                    <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                      {todayOrders.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="scheduled" className="gap-2 px-4">
                  <CalendarClock className="h-4 w-4" />
                  Upcoming
                  {upcomingScheduledOrders.length > 0 && (
                    <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                      {upcomingScheduledOrders.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="history" className="gap-2 px-4">
                  <History className="h-4 w-4" />
                  History
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Tabs
              value={orderTypeFilter}
              onValueChange={(v) =>
                setOrderTypeFilter(v as typeof orderTypeFilter)
              }
            >
              <TabsList>
                <TabsTrigger value="all">All Types</TabsTrigger>
                <TabsTrigger value="pickup">Pickup</TabsTrigger>
                <TabsTrigger value="delivery">Delivery</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {viewMode === "today" && (
            <div className="grid gap-6 lg:grid-cols-3">
              <OrderColumn
                title="New"
                orders={newOrders}
                status="new"
                onStatusChange={handleStatusChange}
                onViewDetails={handleViewDetails}
                showTime // Pass this to display scheduled time
              />
              <OrderColumn
                title="Preparing"
                orders={preparingOrders}
                status="preparing"
                onStatusChange={handleStatusChange}
                onViewDetails={handleViewDetails}
                showTime
              />
              <OrderColumn
                title="Ready"
                orders={readyOrders}
                status="ready"
                onStatusChange={handleStatusChange}
                onViewDetails={handleViewDetails}
                showTime
              />
            </div>
          )}

          {viewMode === "scheduled" && (
            <ScheduledOrdersSection
              orders={upcomingScheduledOrders}
              onStatusChange={handleStatusChange}
              onViewDetails={handleViewDetails}
            />
          )}

          {viewMode === "history" && (
            <PastOrdersSection
              orders={completedOrders}
              onViewDetails={handleViewDetails}
            />
          )}
        </div>
      </main>

      <OrderDetailsSheet
        order={selectedOrder}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}

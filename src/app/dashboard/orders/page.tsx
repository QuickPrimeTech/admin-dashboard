// app/dashboard/orders/page.tsx (or your route)
"use client";
import { useState, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarClock, Clock, History, Loader2 } from "lucide-react";
import { StatsBar } from "@/sections/orders/stats-bar";
import { OrderColumn } from "@/sections/orders/order-column";
import { PastOrdersSection } from "@/sections/orders/past-orders-section";
import { ScheduledOrdersSection } from "@/sections/orders/scheduled-orders-section";
import { OrderDetailsSheet } from "@/sections/orders/order-details-sheet";
import { useOrders } from "@/hooks/use-orders";
import { OrderUI, OrderStatus } from "@/types/order";
import { isToday, startOfDay, endOfDay } from "date-fns";
import { useBranch } from "@/components/providers/branch-provider";

export default function OrdersDashboard() {
  const [selectedOrder, setSelectedOrder] = useState<OrderUI | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [orderTypeFilter, setOrderTypeFilter] = useState<
    "all" | "pickup" | "delivery"
  >("all");
  const [viewMode, setViewMode] = useState<"active" | "scheduled" | "history">(
    "active",
  );
  const { branchId } = useBranch();
  const { orders, isLoading, error, updateStatus } = useOrders({ branchId });

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateStatus({ orderId, newStatus });
  };

  const handleViewDetails = (order: OrderUI) => {
    setSelectedOrder(order);
    setSheetOpen(true);
  };

  const typeFilteredOrders = useMemo(() => {
    if (orderTypeFilter === "all") return orders;
    return orders.filter((order) => order.type === orderTypeFilter);
  }, [orders, orderTypeFilter]);

  const activeOrders = useMemo(() => {
    return typeFilteredOrders
      .filter((o) => o.status !== "completed" && o.priority !== "scheduled")
      .sort((a, b) => {
        if (a.priority === "high" && b.priority !== "high") return -1;
        if (b.priority === "high" && a.priority !== "high") return 1;
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
  }, [typeFilteredOrders]);

  const scheduledOrders = useMemo(() => {
    return typeFilteredOrders
      .filter((o) => o.priority === "scheduled" && o.status !== "completed")
      .sort((a, b) => {
        return (
          (a.scheduledFor?.getTime() || 0) - (b.scheduledFor?.getTime() || 0)
        );
      });
  }, [typeFilteredOrders]);

  const completedOrders = useMemo(() => {
    return typeFilteredOrders
      .filter((o) => o.status === "completed")
      .sort((a, b) => {
        return (
          (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0)
        );
      });
  }, [typeFilteredOrders]);

  const newOrders = activeOrders.filter((o) => o.status === "new");
  const preparingOrders = activeOrders.filter((o) => o.status === "preparing");
  const readyOrders = activeOrders.filter((o) => o.status === "ready");

  const stats = useMemo(() => {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const allActiveOrders = orders.filter((o) => o.status !== "completed");
    const completedToday = orders.filter(
      (o) =>
        o.status === "completed" &&
        o.completedAt &&
        o.completedAt >= todayStart &&
        o.completedAt <= todayEnd,
    ).length;

    const totalRevenue = orders
      .filter((o) => o.status === "completed" && isToday(o.createdAt))
      .reduce((sum, o) => sum + o.total, 0);

    const avgPrepTime = 22; // Calculate from actual data if available

    return {
      totalActive: allActiveOrders.length,
      completedToday,
      totalRevenue,
      avgPrepTime,
    };
  }, [orders]);

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
            {(error as Error).message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <main>
        <div className="mx-auto max-w-[1600px] space-y-6">
          <StatsBar
            totalOrders={stats.totalActive}
            avgPrepTime={stats.avgPrepTime}
            totalRevenue={stats.totalRevenue}
            completedToday={stats.completedToday}
          />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Tabs
              value={viewMode}
              onValueChange={(v) => setViewMode(v as typeof viewMode)}
            >
              <TabsList className="h-11">
                <TabsTrigger value="active" className="gap-2 px-4">
                  <Clock className="h-4 w-4" />
                  Active
                  {activeOrders.length > 0 && (
                    <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                      {activeOrders.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="scheduled" className="gap-2 px-4">
                  <CalendarClock className="h-4 w-4" />
                  Scheduled
                  {scheduledOrders.length > 0 && (
                    <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                      {scheduledOrders.length}
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

          {viewMode === "active" && (
            <div className="grid gap-6 lg:grid-cols-3">
              <OrderColumn
                title="New Orders"
                orders={newOrders}
                status="new"
                onStatusChange={handleStatusChange}
                onViewDetails={handleViewDetails}
              />
              <OrderColumn
                title="Preparing"
                orders={preparingOrders}
                status="preparing"
                onStatusChange={handleStatusChange}
                onViewDetails={handleViewDetails}
              />
              <OrderColumn
                title="Ready"
                orders={readyOrders}
                status="ready"
                onStatusChange={handleStatusChange}
                onViewDetails={handleViewDetails}
              />
            </div>
          )}

          {viewMode === "scheduled" && (
            <ScheduledOrdersSection
              orders={scheduledOrders}
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

"use client";

import { useState, useMemo } from "react";
import { Order, OrderStatus } from "@/types/order";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarClock, Clock, History } from "lucide-react";
import { StatsBar } from "@/sections/orders/stats-bar";
import { OrderColumn } from "@/sections/orders/order-column";
import { PastOrdersSection } from "@/sections/orders/past-orders-section";
import { ScheduledOrdersSection } from "@/sections/orders/scheduled-orders-section";
import { OrderDetailsSheet } from "@/sections/orders/order-details-sheet";
import { mockOrders } from "@/constants/mock-order";

const Index = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [orderTypeFilter, setOrderTypeFilter] = useState<
    "all" | "pickup" | "delivery"
  >("all");
  const [viewMode, setViewMode] = useState<"active" | "scheduled" | "history">(
    "active",
  );

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: newStatus,
              completedAt:
                newStatus === "completed" ? new Date() : order.completedAt,
            }
          : order,
      ),
    );
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setSheetOpen(true);
  };

  // Filter by order type (pickup/delivery)
  const typeFilteredOrders = useMemo(() => {
    if (orderTypeFilter === "all") return orders;
    return orders.filter((order) => order.type === orderTypeFilter);
  }, [orders, orderTypeFilter]);

  // Separate orders by view mode
  const activeOrders = useMemo(() => {
    return typeFilteredOrders
      .filter((o) => o.status !== "completed" && o.priority !== "scheduled")
      .sort((a, b) => {
        // High priority first, then by time
        if (a.priority === "high" && b.priority !== "high") return -1;
        if (b.priority === "high" && a.priority !== "high") return 1;
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
  }, [typeFilteredOrders]);

  const scheduledOrders = useMemo(() => {
    return typeFilteredOrders
      .filter((o) => o.priority === "scheduled" && o.status !== "completed")
      .sort(
        (a, b) =>
          (a.scheduledFor?.getTime() || 0) - (b.scheduledFor?.getTime() || 0),
      );
  }, [typeFilteredOrders]);

  const completedOrders = useMemo(() => {
    return typeFilteredOrders
      .filter((o) => o.status === "completed")
      .sort(
        (a, b) =>
          (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0),
      );
  }, [typeFilteredOrders]);

  // Column data
  const newOrders = activeOrders.filter((o) => o.status === "new");
  const preparingOrders = activeOrders.filter((o) => o.status === "preparing");
  const readyOrders = activeOrders.filter((o) => o.status === "ready");

  // Stats
  const allActiveOrders = orders.filter((o) => o.status !== "completed");
  const completedToday = orders.filter((o) => o.status === "completed").length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="min-h-screen">
      <main>
        <div className="mx-auto max-w-[1600px] space-y-6">
          <StatsBar
            totalOrders={allActiveOrders.length}
            avgPrepTime={22}
            totalRevenue={totalRevenue}
            completedToday={completedToday}
          />

          {/* Main navigation tabs */}
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

            {/* Order type filter */}
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

          {/* Active orders - Kanban view */}
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

          {/* Scheduled orders view */}
          {viewMode === "scheduled" && (
            <ScheduledOrdersSection
              orders={scheduledOrders}
              onStatusChange={handleStatusChange}
              onViewDetails={handleViewDetails}
            />
          )}

          {/* History view */}
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
};

export default Index;

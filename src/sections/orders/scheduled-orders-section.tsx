// sections/orders/scheduled-orders-section.tsx
import { OrderViewModel, OrderStatus } from "@/types/order";
import { CalendarClock } from "lucide-react";
import { isToday, isTomorrow, format } from "date-fns";
import { OrderCard } from "./order-card";

interface ScheduledOrdersSectionProps {
  orders: OrderViewModel[];
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  onViewDetails: (order: OrderViewModel) => void;
}

const groupByScheduleDate = (orders: OrderViewModel[]) => {
  const groups: { label: string; orders: OrderViewModel[] }[] = [];

  const todayOrders = orders.filter(
    (o) => o.scheduledFor && isToday(o.scheduledFor),
  );
  const tomorrowOrders = orders.filter(
    (o) => o.scheduledFor && isTomorrow(o.scheduledFor),
  );
  const laterOrders = orders.filter(
    (o) =>
      o.scheduledFor && !isToday(o.scheduledFor) && !isTomorrow(o.scheduledFor),
  );

  if (todayOrders.length > 0) {
    groups.push({
      label: "Today",
      orders: todayOrders.sort(
        (a, b) =>
          (a.scheduledFor?.getTime() || 0) - (b.scheduledFor?.getTime() || 0),
      ),
    });
  }
  if (tomorrowOrders.length > 0) {
    groups.push({
      label: "Tomorrow",
      orders: tomorrowOrders.sort(
        (a, b) =>
          (a.scheduledFor?.getTime() || 0) - (b.scheduledFor?.getTime() || 0),
      ),
    });
  }
  if (laterOrders.length > 0) {
    const byDate = laterOrders.reduce(
      (acc, order) => {
        const dateKey = order.scheduledFor
          ? format(order.scheduledFor, "EEE, MMM d")
          : "Unknown";
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(order);
        return acc;
      },
      {} as Record<string, OrderViewModel[]>,
    );

    Object.entries(byDate).forEach(([date, orders]) => {
      groups.push({
        label: date,
        orders: orders.sort(
          (a, b) =>
            (a.scheduledFor?.getTime() || 0) - (b.scheduledFor?.getTime() || 0),
        ),
      });
    });
  }

  return groups;
};

export function ScheduledOrdersSection({
  orders,
  onStatusChange,
  onViewDetails,
}: ScheduledOrdersSectionProps) {
  const groups = groupByScheduleDate(orders);

  if (orders.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border">
        <div className="text-center">
          <CalendarClock className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            No scheduled orders
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.label}>
          <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {group.label}
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {group.orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onStatusChange={onStatusChange}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

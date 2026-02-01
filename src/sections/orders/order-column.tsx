// sections/orders/order-column.tsx
import { OrderUI, OrderStatus } from "@/types/order";
import { OrderCard } from "./order-card";
import { cn } from "@/lib/utils";

interface OrderColumnProps {
  title: string;
  orders: OrderUI[];
  status: OrderStatus;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  onViewDetails: (order: OrderUI) => void;
}

const statusConfig = {
  new: {
    color: "bg-primary",
    label: "New Orders",
  },
  preparing: {
    color: "bg-blue-600 dark:bg-blue-400",
    label: "Preparing",
  },
  ready: {
    color: "bg-success",
    label: "Ready",
  },
  completed: {
    color: "bg-muted",
    label: "Completed",
  },
};

export function OrderColumn({
  title,
  orders,
  status,
  onStatusChange,
  onViewDetails,
}: OrderColumnProps) {
  const config = statusConfig[status];

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center gap-3">
        <div className={cn("h-3 w-3 rounded-full", config.color)} />
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">
          {orders.length}
        </span>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-2">
        {orders.length === 0 ? (
          <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border">
            <p className="text-sm text-muted-foreground">No {status} orders</p>
          </div>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusChange={onStatusChange}
              onViewDetails={onViewDetails}
            />
          ))
        )}
      </div>
    </div>
  );
}

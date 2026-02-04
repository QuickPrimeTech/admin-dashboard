// sections/orders/order-card.tsx
import { OrderViewModel, OrderStatus } from "@/types/order";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bike, ShoppingBag, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { isToday } from "date-fns";
import { Separator } from "@/components/ui/separator";
import {
  formatDueTime,
  formatOrderTime,
  useTimeAgo,
} from "@/helpers/time-formatters";
import { getNextAction } from "@/helpers/order-helpers";

interface OrderCardProps {
  order: OrderViewModel;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  onViewDetails: (order: OrderViewModel) => void;
}

export function OrderCard({
  order,
  onStatusChange,
  onViewDetails,
}: OrderCardProps) {
  const isNew = order.status === "new";
  const isPreparing = order.status === "preparing";
  const isReady = order.status === "ready";
  const isScheduled = order.priority === "scheduled" && order.scheduledFor;
  const isTodayOrder = order.scheduledFor && isToday(order.scheduledFor);

  // Auto-updating time display
  const placedTime = useTimeAgo(order.createdAt);

  // Get food names only (no choices/variants)
  const foodNames = order.items.map((item) => item.name).join(", ");

  const nextAction = getNextAction(order, onStatusChange, isScheduled);

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-200",
        "hover:shadow-md hover:border-primary/30",
        isNew && "border-l-4 border-l-primary",
      )}
    >
      <CardContent className="p-4 space-y-3">
        {/* Top row: Type badge + Time info */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant={order.type === "delivery" ? "info" : "warning"}>
              {order.type === "delivery" ? (
                <Bike className="h-3 w-3" />
              ) : (
                <ShoppingBag className="h-3 w-3" />
              )}
              {order.type === "delivery" ? "Delivery" : "Pickup"}
            </Badge>

            {/* Show due time for today orders, otherwise show scheduled */}
            {order.scheduledFor && (
              <span
                className={cn(
                  "text-xs text-muted-foreground",
                  isTodayOrder && "font-medium",
                )}
              >
                {isTodayOrder
                  ? formatDueTime(order.scheduledFor)
                  : formatOrderTime(order.scheduledFor)}
              </span>
            )}
          </div>

          {/* Placed time - auto updates */}
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            Placed {placedTime}
          </span>
        </div>

        {/* Customer name */}
        <div>
          <h3 className="font-semibold leading-tight">{order.customerName}</h3>
        </div>

        {/* Food items - just names, minimal */}
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {foodNames}
        </p>
        <Separator />
        {/* Bottom row: Total + Actions */}
        <div className="flex items-center justify-between ">
          <div>
            <span className="text-xs text-muted-foreground">Total</span>
            <p className="text-lg font-semibold">
              Ksh {order.total.toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onViewDetails(order)}
            >
              Details
            </Button>

            {nextAction && (
              <Button
                onClick={nextAction.action}
                size="sm"
                variant={isNew ? "default" : isPreparing ? "blue" : "success"}
                className="cursor-pointer"
              >
                {nextAction.label}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

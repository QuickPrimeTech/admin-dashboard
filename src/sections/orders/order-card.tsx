// sections/orders/order-card.tsx
import { OrderViewModel, OrderStatus } from "@/types/order";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bike, ShoppingBag, ChevronRight, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { isToday, isBefore } from "date-fns";
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

  // Check if overdue (scheduled time has passed and not completed)
  const isOverdue =
    order.scheduledFor &&
    isBefore(order.scheduledFor, new Date()) &&
    order.status !== "completed";

  // Auto-updating time display
  const placedTime = useTimeAgo(order.createdAt);

  // Get food names only (no choices/variants)
  const foodNames = order.items.map((item) => item.name).join(", ");

  const nextAction = getNextAction(order, onStatusChange, isScheduled);

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-200",
        "hover:shadow-md",
        isOverdue
          ? "border-2 border-destructive shadow-destructive/30"
          : "hover:border-primary/30",
        isNew && !isOverdue && "border-l-4 border-l-primary",
      )}
    >
      {/* Blinking indicator for overdue orders */}
      {isOverdue && (
        <div className="absolute top-3 right-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
          </span>
        </div>
      )}

      {/* Overdue badge */}
      {isOverdue && (
        <div className="absolute -top-px -right-px">
          <Badge className="rounded-tl-none rounded-br-none bg-destructive border-0 font-semibold">
            <AlertCircle className="h-3 w-3 mr-1" />
            Overdue
          </Badge>
        </div>
      )}

      <CardContent className={cn("p-4 space-y-3", isOverdue && "pt-8")}>
        {/* Top row: Type badge + Time info */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
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
                  "text-xs",
                  isOverdue
                    ? "text-destructive font-semibold"
                    : isTodayOrder
                      ? "text-foreground font-medium"
                      : "text-muted-foreground",
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
          <h3
            className={cn(
              "font-semibold leading-tight",
              isOverdue && "text-destructive",
            )}
          >
            {order.customerName}
          </h3>
        </div>

        {/* Food items - just names, minimal */}
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {foodNames}
        </p>
        <Separator />
        {/* Bottom row: Total + Actions */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground">Total</span>
            <p
              className={cn(
                "text-lg font-semibold",
                isOverdue ? "text-destructive" : "text-foreground",
              )}
            >
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
                className={cn("cursor-pointer", isOverdue && "animate-pulse")}
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

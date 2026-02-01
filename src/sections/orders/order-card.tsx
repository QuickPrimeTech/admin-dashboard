// sections/orders/order-card.tsx
import { OrderUI, OrderStatus } from "@/types/order";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  MapPin,
  ShoppingBag,
  Bike,
  User,
  ChevronRight,
  CalendarClock,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isToday, isTomorrow, differenceInHours } from "date-fns";

interface OrderCardProps {
  order: OrderUI;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  onViewDetails: (order: OrderUI) => void;
  compact?: boolean;
}

const formatTimeAgo = (date: Date) => {
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes === 1) return "1 min ago";
  if (minutes < 60) return `${minutes} mins ago`;
  const hours = Math.floor(minutes / 60);
  if (hours === 1) return "1 hour ago";
  return `${hours} hours ago`;
};

const formatScheduledTime = (date: Date) => {
  if (isToday(date)) {
    return `Today at ${format(date, "h:mm a")}`;
  }
  if (isTomorrow(date)) {
    return `Tomorrow at ${format(date, "h:mm a")}`;
  }
  return format(date, "EEE, MMM d 'at' h:mm a");
};

const getScheduleUrgency = (scheduledFor: Date) => {
  const hoursUntil = differenceInHours(scheduledFor, new Date());
  if (hoursUntil < 2) return "urgent";
  if (hoursUntil < 6) return "soon";
  return "later";
};

export function OrderCard({
  order,
  onStatusChange,
  onViewDetails,
  compact = false,
}: OrderCardProps) {
  const isNew = order.status === "new";
  const isPreparing = order.status === "preparing";
  const isReady = order.status === "ready";
  const isScheduled = order.priority === "scheduled" && order.scheduledFor;
  const isHighPriority = order.priority === "high";

  const scheduleUrgency =
    isScheduled && order.scheduledFor
      ? getScheduleUrgency(order.scheduledFor)
      : null;

  const getNextAction = () => {
    switch (order.status) {
      case "new":
        return {
          label: isScheduled ? "Start Prep" : "Accept Order",
          action: () => onStatusChange(order.id, "preparing"),
        };
      case "preparing":
        return {
          label:
            "Ready for " + (order.type === "pickup" ? "Pickup" : "Delivery"),
          action: () => onStatusChange(order.id, "ready"),
        };
      case "ready":
        return {
          label: "Complete Order",
          action: () => onStatusChange(order.id, "completed"),
        };
      default:
        return null;
    }
  };

  const nextAction = getNextAction();

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-200 hover:ring-1 hover:ring-primary/50",
        isNew && !isScheduled && "ring-2 ring-primary",
        isHighPriority && "ring-2 ring-warning",
        isScheduled &&
          scheduleUrgency === "urgent" &&
          "ring-2 ring-destructive",
      )}
    >
      {isNew && !isScheduled && (
        <div className="absolute -right-1 -top-1">
          <span className="relative flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex h-4 w-4 rounded-full bg-primary"></span>
          </span>
        </div>
      )}

      {isHighPriority && (
        <div className="absolute -right-1 -top-1">
          <span className="relative flex h-4 w-4 items-center justify-center rounded-full bg-warning">
            <AlertTriangle className="h-2.5 w-2.5 text-warning-foreground" />
          </span>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold">{order.orderNumber}</span>
            <Badge
              variant="secondary"
              className={cn(
                "gap-1 font-medium",
                order.type === "delivery"
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-orange-500/20 text-orange-400",
              )}
            >
              {order.type === "delivery" ? (
                <>
                  <Bike className="h-3 w-3" />
                  Delivery
                </>
              ) : (
                <>
                  <ShoppingBag className="h-3 w-3" />
                  Pickup
                </>
              )}
            </Badge>
            {isHighPriority && (
              <Badge
                variant="secondary"
                className="gap-1 bg-warning/20 text-warning"
              >
                <AlertTriangle className="h-3 w-3" />
                Priority
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {formatTimeAgo(order.createdAt)}
          </div>
        </div>

        {isScheduled && order.scheduledFor && (
          <div
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
              scheduleUrgency === "urgent" &&
                "bg-destructive/20 text-destructive",
              scheduleUrgency === "soon" && "bg-warning/20 text-warning",
              scheduleUrgency === "later" && "bg-primary/20 text-primary",
            )}
          >
            <CalendarClock className="h-4 w-4" />
            <span>Scheduled: {formatScheduledTime(order.scheduledFor)}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span>{order.customerName}</span>
        </div>

        {order.type === "delivery" && order.deliveryAddress && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
            <span className="line-clamp-1">{order.deliveryAddress}</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {!compact && (
          <div className="space-y-2">
            {order.items.slice(0, 3).map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <div className="flex gap-2">
                  <span className="font-medium text-primary">
                    {item.quantity}×
                  </span>
                  <div>
                    <span>{item.name}</span>
                    {item.modifiers && item.modifiers.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {item.modifiers.join(", ")}
                      </p>
                    )}
                  </div>
                </div>
                <span className="text-muted-foreground">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            {order.items.length > 3 && (
              <p className="text-sm text-muted-foreground">
                +{order.items.length - 3} more items
              </p>
            )}
          </div>
        )}

        {compact && (
          <div className="text-sm text-muted-foreground">
            {order.items.length} item{order.items.length > 1 ? "s" : ""}
          </div>
        )}

        {!compact && order.specialInstructions && (
          <div className="rounded-md bg-warning/10 p-2 text-sm text-warning">
            <span className="font-medium">Note:</span>{" "}
            {order.specialInstructions}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-border pt-3">
          <div>
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-xl font-bold">Ksh {order.total.toFixed(2)}</p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onViewDetails(order)}
            >
              Details
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>

            {nextAction && (
              <Button
                onClick={nextAction.action}
                size="sm"
                variant={
                  isPreparing ? "default" : isReady ? "default" : "default"
                }
                className={cn(
                  isNew && !isScheduled && "animate-pulse",
                  isNew &&
                    isScheduled &&
                    scheduleUrgency === "urgent" &&
                    "bg-destructive hover:bg-destructive/90",
                  isPreparing && "bg-blue-600 hover:bg-blue-700",
                  isReady && "bg-green-600 hover:bg-green-700",
                )}
              >
                {nextAction.label}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

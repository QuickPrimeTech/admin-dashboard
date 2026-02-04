// sections/orders/order-card.tsx
import { OrderViewModel, OrderStatus } from "@/types/order";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bike, ShoppingBag, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  format,
  isToday,
  isYesterday,
  isTomorrow,
  differenceInCalendarDays,
} from "date-fns";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";

// Auto-updating time hook
function useTimeAgo(date: Date) {
  const [timeString, setTimeString] = useState(() => formatOrderTime(date));

  useEffect(() => {
    // Update immediately and then every minute
    setTimeString(formatOrderTime(date));
    const interval = setInterval(() => {
      setTimeString(formatOrderTime(date));
    }, 60000);

    return () => clearInterval(interval);
  }, [date]);

  return timeString;
}

// Friendly time formatting: "Today 2:30 PM", "Yesterday 2:30 PM", "Wednesday 2:30 PM"
const formatOrderTime = (date: Date) => {
  const time = format(date, "h:mm a");

  if (isToday(date)) return `Today ${time}`;
  if (isYesterday(date)) return `Yesterday ${time}`;
  if (isTomorrow(date)) return `Tomorrow ${time}`;

  const daysDiff = differenceInCalendarDays(new Date(), date);
  if (daysDiff < 7) {
    return `${format(date, "EEEE")} ${time}`; // "Wednesday 2:30 PM"
  }

  return format(date, "MMM d, h:mm a"); // "Jan 15, 2:30 PM"
};

// Due time formatting for today orders
const formatDueTime = (date: Date) => {
  return `Due by ${format(date, "h:mm a")}`;
};

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

  const getNextAction = () => {
    switch (order.status) {
      case "new":
        return {
          label: isScheduled ? "Start Prep" : "Accept",
          action: () => onStatusChange(order.id, "preparing"),
        };
      case "preparing":
        return {
          label: "Ready",
          action: () => onStatusChange(order.id, "ready"),
        };
      case "ready":
        return {
          label: "Complete",
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
        "relative overflow-hidden transition-all duration-200",
        "hover:shadow-md hover:border-primary/30",
        isNew && "border-l-4 border-l-primary",
      )}
    >
      <CardContent className="p-4 space-y-3">
        {/* Top row: Type badge + Time info */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className={cn(
                "gap-1.5 font-normal text-xs",
                order.type === "delivery"
                  ? "bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-200 hover:bg-sky-100 dark:hover:bg-sky-800"
                  : "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-800",
              )}
            >
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

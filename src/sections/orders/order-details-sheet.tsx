import { Order, OrderStatus } from "@/types/order";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  MapPin,
  ShoppingBag,
  Bike,
  User,
  Phone,
  MessageSquare,
  Printer,
  CalendarClock,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isToday, isTomorrow } from "date-fns";
import Link from "next/link";

interface OrderDetailsSheetProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
}

const statusLabels: Record<OrderStatus, string> = {
  new: "New Order",
  preparing: "Preparing",
  ready: "Ready",
  completed: "Completed",
};

const statusColors: Record<OrderStatus, string> = {
  new: "bg-primary text-primary-foreground",
  preparing: "bg-warning text-warning-foreground",
  ready: "bg-success text-success-foreground",
  completed: "bg-muted text-muted-foreground",
};

const formatScheduledTime = (date: Date) => {
  if (isToday(date)) {
    return `Today at ${format(date, "h:mm a")}`;
  }
  if (isTomorrow(date)) {
    return `Tomorrow at ${format(date, "h:mm a")}`;
  }
  return format(date, "EEEE, MMMM d 'at' h:mm a");
};

export function OrderDetailsSheet({
  order,
  open,
  onOpenChange,
  onStatusChange,
}: OrderDetailsSheetProps) {
  if (!order) return null;

  const isScheduled = order.priority === "scheduled" && order.scheduledFor;
  const isHighPriority = order.priority === "high";
  const isCompleted = order.status === "completed";

  const getNextAction = () => {
    switch (order.status) {
      case "new":
        return {
          label: isScheduled ? "Start Preparation" : "Accept Order",
          action: () => onStatusChange(order.id, "preparing"),
        };
      case "preparing":
        return {
          label: "Mark as Ready",
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
  const orderTime = order.createdAt.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="rounded-l-xl w-full overflow-y-auto sm:max-w-lg px-6 py-10">
        <SheetHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SheetTitle className="text-2xl">{order.orderNumber}</SheetTitle>
              {isHighPriority && (
                <Badge className="gap-1 bg-warning/20 text-warning">
                  <AlertTriangle className="h-3 w-3" />
                  Priority
                </Badge>
              )}
            </div>
            <Badge className={cn("text-sm", statusColors[order.status])}>
              {statusLabels[order.status]}
            </Badge>
          </div>

          {/* Scheduled banner */}
          {isScheduled && order.scheduledFor && (
            <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-3 text-primary">
              <CalendarClock className="h-5 w-5" />
              <div>
                <p className="text-sm font-medium">Scheduled Order</p>
                <p className="text-sm">
                  {formatScheduledTime(order.scheduledFor)}
                </p>
              </div>
            </div>
          )}

          {/* Completed banner */}
          {isCompleted && order.completedAt && (
            <div className="flex items-center gap-2 rounded-lg bg-success/10 px-4 py-3 text-success">
              <CheckCircle2 className="h-5 w-5" />
              <div>
                <p className="text-sm font-medium">Order Completed</p>
                <p className="text-sm">
                  {format(order.completedAt, "EEEE, MMMM d 'at' h:mm a")}
                </p>
              </div>
            </div>
          )}

          <SheetDescription className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Placed at {orderTime}
            </span>
            <Badge
              variant="secondary"
              className={cn(
                "gap-1",
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
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Customer Info */}
          <div className="space-y-3">
            <h3 className="font-semibold">Customer</h3>
            <div className="space-y-2 rounded-lg bg-secondary p-4">
              <div className="flex items-center gap-2">
                <User className="size-4 text-muted-foreground" />
                <span>{order.customerName}</span>
              </div>
              {order.type === "delivery" && order.deliveryAddress && (
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <span className="text-sm">{order.deliveryAddress}</span>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <Button variant="success" size="sm" className="gap-1" asChild>
                  <Link href={`tel:${order.orderNumber}`}>
                    <Phone className="size-4" />
                    Call
                  </Link>
                </Button>
                <Button variant="blue" size="sm" className="gap-1">
                  <MessageSquare className="h-4 w-4" />
                  Message
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          <div className="space-y-3">
            <h3 className="font-semibold">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <div className="flex gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded bg-primary/20 text-sm font-medium text-primary">
                      {item.quantity}
                    </span>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      {item.modifiers && item.modifiers.length > 0 && (
                        <p className="text-sm text-muted-foreground">
                          {item.modifiers.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {order.specialInstructions && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-semibold">Special Instructions</h3>
                <div className="rounded-lg bg-warning/10 p-3 text-warning">
                  {order.specialInstructions}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Order Summary */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${(order.total * 0.9).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax</span>
              <span>${(order.total * 0.1).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 gap-2">
              <Printer className="h-4 w-4" />
              Print
            </Button>
            {nextAction && (
              <Button
                onClick={() => {
                  nextAction.action();
                  onOpenChange(false);
                }}
                variant={
                  order.status === "preparing"
                    ? "blue"
                    : order.status === "ready"
                      ? "success"
                      : "default"
                }
                className={cn("flex-1")}
              >
                {nextAction.label}
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

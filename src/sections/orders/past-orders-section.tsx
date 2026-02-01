// sections/orders/past-orders-section.tsx
import { OrderUI } from "@/types/order";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  MapPin,
  ShoppingBag,
  Bike,
  User,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isToday, isYesterday } from "date-fns";

interface PastOrdersSectionProps {
  orders: OrderUI[];
  onViewDetails: (order: OrderUI) => void;
}

const formatCompletedTime = (date: Date) => {
  if (isToday(date)) {
    return `Today at ${format(date, "h:mm a")}`;
  }
  if (isYesterday(date)) {
    return `Yesterday at ${format(date, "h:mm a")}`;
  }
  return format(date, "EEE, MMM d 'at' h:mm a");
};

const groupByDate = (orders: OrderUI[]) => {
  const groups: { label: string; orders: OrderUI[] }[] = [];

  const todayOrders = orders.filter(
    (o) => o.completedAt && isToday(o.completedAt),
  );
  const yesterdayOrders = orders.filter(
    (o) => o.completedAt && isYesterday(o.completedAt),
  );
  const olderOrders = orders.filter(
    (o) =>
      o.completedAt && !isToday(o.completedAt) && !isYesterday(o.completedAt),
  );

  if (todayOrders.length > 0) {
    groups.push({
      label: "Today",
      orders: todayOrders.sort(
        (a, b) =>
          (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0),
      ),
    });
  }
  if (yesterdayOrders.length > 0) {
    groups.push({
      label: "Yesterday",
      orders: yesterdayOrders.sort(
        (a, b) =>
          (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0),
      ),
    });
  }
  if (olderOrders.length > 0) {
    groups.push({
      label: "Earlier",
      orders: olderOrders.sort(
        (a, b) =>
          (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0),
      ),
    });
  }

  return groups;
};

function PastOrderCard({
  order,
  onViewDetails,
}: {
  order: OrderUI;
  onViewDetails: (order: OrderUI) => void;
}) {
  return (
    <Card className="bg-secondary/50 transition-all hover:bg-secondary">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/20">
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold">{order.orderNumber}</span>
                <Badge
                  variant="secondary"
                  className={cn(
                    "gap-1 text-xs",
                    order.type === "delivery"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-orange-500/20 text-orange-400",
                  )}
                >
                  {order.type === "delivery" ? (
                    <>
                      <Bike className="h-2.5 w-2.5" />
                      Delivery
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-2.5 w-2.5" />
                      Pickup
                    </>
                  )}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-3 w-3" />
                <span>{order.customerName}</span>
                {order.type === "delivery" && order.deliveryAddress && (
                  <>
                    <span>•</span>
                    <MapPin className="h-3 w-3" />
                    <span className="line-clamp-1 max-w-[150px]">
                      {order.deliveryAddress}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="font-bold">${order.total.toFixed(2)}</p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {order.completedAt && formatCompletedTime(order.completedAt)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails(order)}
              className="text-muted-foreground hover:text-foreground"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function PastOrdersSection({
  orders,
  onViewDetails,
}: PastOrdersSectionProps) {
  const groups = groupByDate(orders);

  if (orders.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border">
        <div className="text-center">
          <CheckCircle2 className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            No completed orders yet
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
          <div className="space-y-2">
            {group.orders.map((order) => (
              <PastOrderCard
                key={order.id}
                order={order}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

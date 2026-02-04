// sections/orders/order-details-sheet.tsx
import { OrderViewModel, OrderStatus, OrderItem } from "@/types/order";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  ShoppingBag,
  Phone,
  Printer,
  ChevronRight,
  User,
  Mail,
  Clock,
  Utensils,
  AlertCircle,
  Calendar,
  ChefHat,
  PackageCheck,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Link from "next/link";
import { ReactNode } from "react";
import { useTimeAgo } from "@/helpers/time-formatters";
import { getNextAction } from "@/helpers/order-helpers";
import { formatDate } from "@/utils/date-formatters";

interface OrderDetailsSheetProps {
  order: OrderViewModel | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
}

const statusLabels: Record<OrderStatus, string> = {
  new: "New",
  preparing: "Preparing",
  ready: "Ready",
  completed: "Completed",
};

// Reusable section component
function Section({
  title,
  icon: Icon,
  children,
  className,
}: {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("py-4 space-y-3", className)}>
      <div className="flex items-center gap-2 text-muted-foreground">
        {Icon && <Icon className="h-4 w-4" />}
        <h3 className="text-sm font-semibold uppercase tracking-wide">
          {title}
        </h3>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

// Reusable info row
function InfoRow({
  icon: Icon,
  label,
  value,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label?: string;
  value: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          {label && <p className="text-xs text-muted-foreground">{label}</p>}
          <p className="text-sm text-foreground truncate">{value}</p>
        </div>
      </div>
      {action}
    </div>
  );
}

// Order item with choices
function OrderItemCard({ item, index }: { item: OrderItem; index: number }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-border last:border-0">
      <div className="flex items-start gap-3 flex-1">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
          {index + 1}
        </span>
        <div className="flex-1 space-y-1">
          <div className="flex gap-1 items-center font-medium text-foreground">
            <p>{item.name}</p>x<span>{item.quantity}</span>
          </div>

          {/* Choices with labels */}
          {item.choices && item.menuItem?.choices && (
            <div className="space-y-0.5">
              {item.menuItem.choices.map((choice) => {
                const selection = item.choices[choice.id];
                if (!selection) return null;

                const value = Array.isArray(selection)
                  ? selection.join(", ")
                  : selection;

                return (
                  <p key={choice.id} className="text-sm">
                    <span className="text-muted-foreground">
                      {choice.title}:
                    </span>{" "}
                    {value}
                  </p>
                );
              })}
            </div>
          )}

          <div className="flex items-start gap-2 text-xs bg-warning/40 rounded-sm px-2 py-1">
            <AlertCircle className="h-4 w-4 text-warning-foreground  mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-warning-foreground">
                Special Note for {item.name}
              </p>
              <p className="text-warning-foreground mt-0.5">
                {item.specialInstructions}
              </p>
            </div>
          </div>
        </div>
      </div>
      <span className="font-medium text-foreground shrink-0">
        Ksh {item.price.toLocaleString()}
      </span>
    </div>
  );
}

// Status badge component
function StatusBadge({ status }: { status: OrderStatus }) {
  const config: Record<
    OrderStatus,
    { color: string; icon: React.ComponentType<{ className?: string }> }
  > = {
    new: {
      color: "bg-primary/10 text-primary border border-primary/20",
      icon: ShoppingBag,
    },
    preparing: {
      color:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800",
      icon: ChefHat,
    },
    ready: {
      color:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800",
      icon: PackageCheck,
    },
    completed: {
      color: "bg-muted text-muted-foreground border border-border",
      icon: CheckCircle2,
    },
  };

  const { color, icon: Icon } = config[status];

  return (
    <div className={cn("flex items-center gap-2 px-3 py-2 rounded-lg", color)}>
      <Icon className="size-4" />
      <SheetTitle className="font-medium text-sm">
        {statusLabels[status]} Order
      </SheetTitle>
    </div>
  );
}

export function OrderDetailsSheet({
  order,
  open,
  onOpenChange,
  onStatusChange,
}: OrderDetailsSheetProps) {
  if (!order) return null;

  const placedTime = useTimeAgo(order.createdAt);

  const basePrice = Math.floor(order.total * (1 / 1.18));

  const isScheduled = order.priority === "scheduled" && order.scheduledFor;

  const nextAction = getNextAction(order, onStatusChange, isScheduled);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto px-4 pb-8 rounded-2xl">
        {/* Header */}
        <SheetHeader className="p-0 pt-4 pr-10">
          <StatusBadge status={order.status} />
        </SheetHeader>

        {/* Customer Details */}
        <Section title="Customer Details" icon={User}>
          <InfoRow icon={User} label="Name" value={order.customerName} />
          <InfoRow icon={Mail} label="Email" value={order.email} />
          <InfoRow
            icon={Phone}
            label="Phone"
            value={order.phone}
            action={
              <Button
                variant="success"
                size="sm"
                className="rounded-full"
                asChild
              >
                <Link
                  href={`tel:${order.phone}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <Phone className="size-4 mr-1" />
                  Call Customer
                </Link>
              </Button>
            }
          />
        </Section>

        <Separator />

        {/* Pickup/Delivery Details */}
        <Section
          title={
            order.type === "delivery" ? "Delivery Details" : "Pickup Details"
          }
          icon={order.type === "delivery" ? MapPin : ShoppingBag}
        >
          {order.type === "delivery" && order.deliveryAddress ? (
            <InfoRow
              icon={MapPin}
              label="Address"
              value={order.deliveryAddress}
            />
          ) : (
            <>
              <InfoRow
                icon={Clock}
                label="Pickup Time"
                value={
                  isScheduled && order.scheduledFor
                    ? format(order.scheduledFor, "h:mm a")
                    : "Ready in 20-30 mins"
                }
              />
              <InfoRow
                icon={Calendar}
                label="Pickup Date"
                value={
                  order.scheduledFor &&
                  formatDate(order.scheduledFor.toString())
                }
              />
              <InfoRow icon={Calendar} label="Date Placed" value={placedTime} />
            </>
          )}
        </Section>

        <Separator />

        {/* Order Details */}
        <Section title="Order Details" icon={Utensils}>
          <div className="space-y-1">
            {order.items.map((item, index) => (
              <OrderItemCard
                key={item.cartItemId || index}
                item={item}
                index={index}
              />
            ))}
          </div>

          {/* Special Instructions */}
          {order.specialInstructions && (
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
                    Special Note for Order
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-400 mt-0.5">
                    {order.specialInstructions}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Section>

        <Separator />

        {/* Payment Summary */}
        <div className="py-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-foreground">
              Ksh {basePrice.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">VAT (16%)</span>
            <span className="text-foreground">
              Ksh {(basePrice * 0.16).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Catering Levy (2%)</span>
            <span className="text-foreground">
              Ksh {(basePrice * 0.02).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-border">
            <span className="text-base font-semibold">Total</span>
            <span className="text-2xl font-bold text-primary">
              Ksh {order.total.toLocaleString()}
            </span>
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className="pt-4 flex gap-3">
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
                order.status === "new"
                  ? "default"
                  : order.status === "preparing"
                    ? "blue"
                    : "success"
              }
              className="flex-1 gap-1 cursor-pointer"
            >
              {nextAction.label}
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

import { useState } from "react";
import { Button } from "@ui/button";
import { Badge } from "@ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";
import {
  Bell,
  Utensils,
  Truck,
  Clock,
  Check,
  ChefHat,
  Wine,
  Users,
  PackageCheck,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type:
    | "new_order"
    | "event_booking"
    | "order_ready"
    | "delivery_out"
    | "special_request"
    | "private_event";
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  avatar?: string;
  customer?: string;
  orderId?: string;
  amount?: string;
}

const fakeNotifications: Notification[] = [
  {
    id: "3",
    type: "order_ready",
    title: "Order Ready for Pickup",
    description: "Order #ORD-7821 has been ready for 5 minutes",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
    read: false,
    orderId: "#ORD-7821",
    customer: "Emma Thompson",
  },
  {
    id: "4",
    type: "delivery_out",
    title: "Out for Delivery",
    description: "Driver Mike picked up order #ORD-7815 (2.4km away)",
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
    read: true,
    orderId: "#ORD-7815",
    customer: "David Park",
  },
  {
    id: "5",
    type: "special_request",
    title: "Dietary Alert",
    description: "Table 5 has severe nut allergy — Birthday cake order",
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    read: false,
  },
  {
    id: "6",
    type: "event_booking",
    title: "Wine Tasting Confirmed",
    description: "Private wine pairing event for 8 guests — Saturday 6:00 PM",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    read: true,
    customer: "The Anderson Group",
    amount: "$890.00",
  },
];

const notificationIcons = {
  new_order: Utensils,
  event_booking: Wine,
  order_ready: PackageCheck,
  delivery_out: Truck,
  special_request: Flame,
  private_event: Users,
};

const notificationColors = {
  new_order: "text-orange-600 bg-orange-100",
  event_booking: "text-purple-600 bg-purple-100",
  order_ready: "text-green-600 bg-green-100",
  delivery_out: "text-blue-600 bg-blue-100",
  special_request: "text-red-600 bg-red-100",
  private_event: "text-indigo-600 bg-indigo-100",
};

const priorityBadge = (type: string) => {
  switch (type) {
    case "special_request":
      return (
        <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-medium">
          URGENT
        </span>
      );
    case "order_ready":
      return (
        <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">
          READY
        </span>
      );
    default:
      return null;
  }
};

function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
}

export function Notifications() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(fakeNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const hasUnread = unreadCount > 0;
  const urgentCount = notifications.filter(
    (n) => !n.read && n.type === "special_request",
  ).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="relative"
          aria-label={`view notifications ${hasUnread ? `(${unreadCount} unread)` : ""}`}
          title="See your notifications"
        >
          <Bell
            className={cn("transition-colors", hasUnread && "text-foreground")}
          />
          {hasUnread && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white ring-2 ring-background">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-96 p-0" align="end" sideOffset={5}>
        <div className="flex items-center justify-between border-b px-4 py-3 bg-muted/30">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-sm">Kitchen Alerts</h4>
            {urgentCount > 0 && (
              <Badge variant="destructive" className="h-5 text-[10px]">
                {urgentCount} urgent
              </Badge>
            )}
          </div>
          {hasUnread && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-8 text-xs gap-1"
            >
              <Check className="h-3 w-3" />
              Mark all read
            </Button>
          )}
        </div>

        <div className="max-h-[45vh] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <ChefHat className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm font-medium">All caught up!</p>
              <p className="text-xs mt-1">No new orders or events</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => {
                const Icon = notificationIcons[notification.type];
                const colorClass = notificationColors[notification.type];

                return (
                  <button
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={cn(
                      "relative flex w-full items-start gap-3 px-4 py-3.5 text-left transition-all hover:bg-muted/60",
                      !notification.read &&
                        "bg-orange-50/50 dark:bg-orange-950/20",
                      notification.type === "special_request" &&
                        !notification.read &&
                        "bg-red-50/60 dark:bg-red-950/20",
                    )}
                  >
                    {!notification.read && (
                      <span className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500" />
                    )}

                    {notification.avatar ? (
                      <Avatar className="h-10 w-10 shrink-0 ring-2 ring-background shadow-sm">
                        <AvatarImage
                          src={notification.avatar}
                          alt={notification.customer}
                        />
                        <AvatarFallback className="text-xs bg-muted">
                          {notification.customer
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm",
                          colorClass,
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={cn(
                            "text-sm leading-tight",
                            !notification.read &&
                              "font-semibold text-foreground",
                            notification.type === "special_request" &&
                              "text-red-700 dark:text-red-300",
                          )}
                        >
                          {notification.title}
                        </p>
                        {priorityBadge(notification.type)}
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {notification.description}
                      </p>

                      <div className="flex items-center gap-2 pt-0.5">
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(notification.timestamp)}
                        </span>
                        {notification.amount && (
                          <span className="text-[10px] font-medium text-foreground">
                            {notification.amount}
                          </span>
                        )}
                        {notification.orderId && (
                          <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1 rounded">
                            {notification.orderId}
                          </span>
                        )}
                      </div>
                    </div>

                    {!notification.read && (
                      <span className="mt-2 h-2 w-2 rounded-full bg-orange-500 shrink-0 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="border-t bg-muted/30 p-2 flex gap-2">
          <Button size={"sm"} className="flex-1">
            View order dashboard
          </Button>
          <Button variant="secondary" size={"sm"} className="flex-1">
            Event calendar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

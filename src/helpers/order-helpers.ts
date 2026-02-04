import { OrderStatus, OrderViewModel } from "@/types/order";

export const getNextAction = (
  order: OrderViewModel,
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void,
  isScheduled: false | Date | null,
) => {
  switch (order.status) {
    case "new":
      return {
        label: isScheduled ? "Start Prep" : "Accept",
        action: () => onStatusChange(order.id, "preparing"),
      };
    case "preparing":
      return {
        label: "Mark Ready",
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

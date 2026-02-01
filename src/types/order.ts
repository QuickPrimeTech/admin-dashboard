export type OrderStatus = "new" | "preparing" | "ready" | "completed";
export type OrderType = "pickup" | "delivery";
export type OrderPriority = "normal" | "high" | "scheduled";

export type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  modifiers?: string[];
};

export type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  type: OrderType;
  status: OrderStatus;
  priority: OrderPriority;
  items: OrderItem[];
  total: number;
  createdAt: Date;
  scheduledFor?: Date;
  completedAt?: Date;
  estimatedTime?: number;
  specialInstructions?: string;
  deliveryAddress?: string;
};

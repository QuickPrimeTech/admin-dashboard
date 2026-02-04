// types/order.ts
export type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  modifiers?: string[];
};

export type OrderStatus = "new" | "preparing" | "ready" | "completed";
export type OrderType = "delivery" | "pickup";
export type OrderPriority = "normal" | "high" | "scheduled";

export type OrderUI = {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  type: OrderType;
  status: OrderStatus;
  priority: OrderPriority;
  items: OrderItem[];
  total: number;
  deliveryAddress?: string;
  specialInstructions?: string;
  createdAt: Date;
  scheduledFor?: Date;
  completedAt?: Date;
  branchId: string;
  paymentMethod: string;
};

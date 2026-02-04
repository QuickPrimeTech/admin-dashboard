// types/order.ts

import { z } from "zod";

// ==================== Choice & Menu Types (from your schema) ====================

export const choiceOptionSchema = z.object({
  label: z.string(),
  price: z.number(),
});

export const choiceSchema = z.object({
  id: z.string(),
  title: z.string(),
  required: z.boolean(),
  maxSelectable: z.number().optional(),
  options: z.array(choiceOptionSchema),
});

export const menuItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  price: z.number(),
  description: z.string(),
  category: z.string(),
  image_url: z.string().nullable(),
  public_id: z.string().nullable(),
  lqip: z.string().nullable(),
  is_available: z.boolean(),
  is_popular: z.boolean(),
  start_time: z.string(),
  end_time: z.string(),
  branch_id: z.string(),
  created_at: z.string(),
  choices: z.array(choiceSchema),
  dietary_preference: z.array(z.string()),
});

// ==================== Order Item Types ====================

// Individual choice selection from customer
// Key: choice ID, Value: selected option label(s)
export type CustomerChoices = Record<string, string | string[]>;

// The actual structure stored in items JSONB
export type OrderItem = {
  id: number; // menu_item id
  name: string; // item name at time of order
  price: number; // price paid (base price)
  quantity: number;
  choices: CustomerChoices; // customer's selections
  menuItem: MenuItemSnapshot; // snapshot of menu data at order time
  cartItemId: string; // uuid from cart
  image_url: string | null;
  specialInstructions: string;
};

// Snapshot of menu item data (denormalized for order history)
export type MenuItemSnapshot = z.infer<typeof menuItemSchema>;

// ==================== Database Order Type ====================

export type OrderDB = {
  id: string; // uuid
  created_at: string; // iso timestamp
  name: string; // customer name
  phone: string;
  email: string;
  items: OrderItem[]; // JSONB array
  total: number; // numeric(10,2)
  payment_method: string;
  pickup_date: string | null;
  pickup_time: string | null;
  delivery_date: string | null;
  delivery_time: string | null;
  delivery_address: string | null;
  special_instructions: string | null;
  status: "pending" | "success";
  order_status: OrderStatus | null;
  branch_id: string; // uuid
};

// ==================== UI/Application Types ====================

export type OrderStatus = "new" | "preparing" | "ready" | "completed";
export type OrderType = "delivery" | "pickup";
export type OrderPriority = "normal" | "high" | "scheduled";

export type OrderUI = {
  id: string;
  orderNumber: string; // formatted for display (e.g., "#001234")
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
  scheduledFor?: Date; // pickup or delivery datetime
  completedAt?: Date;
  branchId: string;
  paymentMethod: string;
};

// ==================== Helper Types for Calculations ====================

export type ParsedChoice = {
  choiceId: string;
  title: string;
  selected: string[];
  additionalCost: number;
};

// Type guard to check if choice value is multi-select
export function isMultiSelect(value: string | string[]): value is string[] {
  return Array.isArray(value);
}

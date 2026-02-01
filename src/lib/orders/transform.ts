// lib/orders/transform.ts
import { Tables } from "@/types/supabase";
import { OrderUI, OrderItem } from "@/types/order";

export function transformOrder(row: Tables<"orders">): OrderUI {
  // Parse items from JSONB - handles the menu item structure
  const rawItems = (row.items as any[]) || [];
  const items: OrderItem[] = rawItems.map(
    (item): OrderItem => ({
      id: item.id || Math.random().toString(36).substr(2, 9),
      name: item.name || "Unknown Item",
      quantity: item.quantity || 1,
      price: Number(item.price) || 0,
      // Handle modifiers from choices if present
      //   modifiers:
      //     item.modifiers ||
      //     (item.choices
      //       ? item.choices.map(
      //           (c: any) =>
      //             `${c.title}: ${c.selectedOptions?.map((o: any) => o.label).join(", ")}`,
      //         )
      //       : undefined),
    }),
  );

  // Determine order type
  const isDelivery = !!row.delivery_address;

  // Determine scheduled time
  let scheduledFor: Date | undefined;
  if (isDelivery && row.delivery_date && row.delivery_time) {
    scheduledFor = new Date(`${row.delivery_date}T${row.delivery_time}`);
  } else if (!isDelivery && row.pickup_date && row.pickup_time) {
    scheduledFor = new Date(`${row.pickup_date}T${row.pickup_time}`);
  }

  // Determine priority
  let priority: OrderUI["priority"] = "normal";
  if (scheduledFor && scheduledFor > new Date()) {
    priority = "scheduled";
  }

  // High priority if special instructions contain urgent markers or if very recent (< 5 mins)
  const isRecent =
    new Date().getTime() - new Date(row.created_at).getTime() < 5 * 60 * 1000;
  if (row.special_instructions?.toLowerCase().includes("urgent") || isRecent) {
    priority = "high";
  }

  // Map DB status to UI status
  const statusMap: Record<string, OrderUI["status"]> = {
    pending: "new",
    preparing: "preparing",
    ready: "ready",
    completed: "completed",
    cancelled: "completed",
  };

  // Generate order number from UUID (first 8 chars)
  const orderNumber = `#${row.id.substring(0, 8).toUpperCase()}`;

  return {
    id: row.id,
    orderNumber,
    customerName: row.name,
    email: row.email,
    phone: row.phone,
    type: isDelivery ? "delivery" : "pickup",
    status: statusMap[row.status] || "new",
    priority,
    items,
    total: Number(row.total),
    deliveryAddress: row.delivery_address || undefined,
    specialInstructions: row.special_instructions || undefined,
    createdAt: new Date(row.created_at),
    scheduledFor,
    // Note: DB doesn't have completed_at, we track this client-side or use updated_at
    completedAt: row.status === "completed" ? new Date() : undefined,
    branchId: row.branch_id,
    paymentMethod: row.payment_method,
  };
}

export function transformOrders(rows: Tables<"orders">[]): OrderUI[] {
  return rows.map(transformOrder);
}

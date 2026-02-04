// app/api/orders/[id]/route.ts
import { createResponse } from "@/helpers/api-responses";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";
import {
  orderStatusSchema,
  isValidStatusTransition,
  validTransitions,
  OrderStatus,
} from "@/types/order";
import { z } from "zod";
import { getCurrentBranchId } from "@/helpers/common";
import { Params } from "@/types/api";

// Validation schema for the request body
const patchSchema = z.object({
  order_status: orderStatusSchema,
});

export async function PATCH(request: NextRequest, { params }: Params) {
  const supabase = await createClient();

  try {
    // 1. Validate request body
    const body = await request.json();
    console.log("body is ------->", body);
    const parseResult = patchSchema.safeParse(body);

    if (!parseResult.success) {
      return createResponse(
        400,
        "Invalid order status. Must be: new, preparing, ready, or completed",
      );
    }

    const { order_status: newStatus } = parseResult.data;
    const { id } = await params;

    //Get the current branch id
    const branchId = await getCurrentBranchId();

    // 2. Get current order to check transition validity
    const { data: currentOrder, error: fetchError } = await supabase
      .from("orders")
      .select("order_status, id")
      .eq("id", id)
      .eq("branch_id", branchId)
      .single();

    if (fetchError) {
      console.log("fetch error", fetchError);
      return createResponse(404, "Order not found");
    }

    // 3. Validate status transition
    const currentStatus = currentOrder.order_status as OrderStatus;

    if (currentStatus === newStatus) {
      return createResponse(400, `Order is already ${newStatus}`);
    }

    if (!isValidStatusTransition(currentStatus, newStatus)) {
      return createResponse(
        400,
        `Cannot transition from ${currentStatus} to ${newStatus}. Valid transitions: ${validTransitions[currentStatus].join(", ") || "none"}`,
      );
    }

    // 4. Perform update
    const { data, error: updateError } = await supabase
      .from("orders")
      .update({ order_status: newStatus })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      return createResponse(500, "Failed to update order status");
    }

    // 5. Return success with message
    const messages: Record<OrderStatus, string> = {
      new: "Order marked as new",
      preparing: "Order is now being prepared",
      ready: "Order is ready for pickup/delivery",
      completed: "Order completed successfully",
    };

    return createResponse(200, messages[newStatus], data);
  } catch (error) {
    console.error("PATCH /api/orders/[id] error:", error);
    return createResponse(500, "Internal server error");
  }
}

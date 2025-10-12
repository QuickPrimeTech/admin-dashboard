import { getAuthenticatedUser } from "@/helpers/common";
import { NextResponse } from "next/server";

export async function GET() {
  const { supabase, user } = await getAuthenticatedUser();

  try {
    // Fetch essential data only (raw payments + orders)
    const [
      { data: payments, error: paymentsError },
      { data: orders, error: ordersError },
    ] = await Promise.all([
      supabase
        .from("payments")
        .select("id, amount, status, created_at, phone, user_id, order_id"),
      supabase
        .from("orders")
        .select(
          "id, items, total, status, payment_method, pickup_time, created_at, user_id, name, phone"
        ),
    ]);

    if (paymentsError) throw paymentsError;
    if (ordersError) throw ordersError;

    // If empty
    if (
      (!payments || payments.length === 0) &&
      (!orders || orders.length === 0)
    ) {
      return NextResponse.json({ success: true, data: [] });
    }

    return NextResponse.json({
      success: true,
      data: {
        payments,
        orders,
      },
    });
  } catch (err: any) {
    console.error("Analytics fetch error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

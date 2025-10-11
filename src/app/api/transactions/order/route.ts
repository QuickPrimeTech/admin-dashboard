import { getAuthenticatedUser } from "@/helpers/common";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { supabase } = await getAuthenticatedUser();

  const url = new URL(req.url);
  const order_id = url.searchParams.get("order_id");

  if (!order_id) {
    return NextResponse.json({
      status: 400,
      success: false,
      message: "Order Id is required",
    });
  }

  // Payments joined with orders to get customer name
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", order_id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({
      status: 500,
      success: false,
      message: "An error occurred while fetching transactions",
    });
  }

  return NextResponse.json({
    status: 200,
    success: true,
    data,
    message: "Transactions fetched successfully",
  });
}

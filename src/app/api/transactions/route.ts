import { getAuthenticatedUser } from "@/helpers/common";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { supabase } = await getAuthenticatedUser();

  // Get the phone number from query params
  const url = new URL(req.url);
  const phone = url.searchParams.get("phone");

  // Build the base query: payments joined with orders to get customer name
  let query = supabase
    .from("payments")
    .select(
      `
      *,
      order:orders(name)
    `
    )
    .order("created_at", { ascending: false });

  // Filter by phone if provided
  if (phone) {
    query = query.eq("phone", phone);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({
      status: 500,
      success: false,
      message: "An error occurred while trying to fetch your transactions",
    });
  }

  return NextResponse.json({
    status: 200,
    success: true,
    data,
    message: "Transactions fetched successfully",
  });
}

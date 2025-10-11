import { getAuthenticatedUser } from "@/helpers/common";
import { NextResponse } from "next/server";

export async function GET() {
  const { supabase } = await getAuthenticatedUser();

  // Join payments with orders to get customer name
  const { data, error } = await supabase
    .from("payments")
    .select(
      `
      *,
      order:orders(name)
    `
    )
    .order("created_at", { ascending: false });

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

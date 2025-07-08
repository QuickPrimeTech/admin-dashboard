import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase"; // Adjust if you use a different import

export async function POST(request: NextRequest) {
  //   console.log(updates);
  try {
    const { updates } = await request.json();
    if (!Array.isArray(updates)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payload: 'updates' must be an array.",
        },
        { status: 400 }
      );
    }

    // Perform bulk update (parallelized)
    const updatePromises = updates.map(
      (item: { id: string; order_index: number }) =>
        supabase
          .from("faqs")
          .update({ order_index: item.order_index })
          .eq("id", item.id)
    );

    const results = await Promise.all(updatePromises);

    // Check for any errors
    const hasError = results.some((res) => res.error);
    if (hasError) {
      const firstError = results.find((res) => res.error)?.error;
      console.error("Supabase reorder error:", firstError?.message);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to reorder some FAQs",
          error: firstError?.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "FAQ order updated successfully",
    });
  } catch (err) {
    const error = err as Error;
    console.error("Unexpected server error:", error.message);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

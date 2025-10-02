import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/helpers/common";

export async function POST(request: NextRequest) {
  try {
    const { user, supabase, response } = await getAuthenticatedUser();
    if (!user) return response;

    const { updates } = await request.json();

    if (!Array.isArray(updates)) {
      return NextResponse.json(
        { success: false, message: "'updates' must be an array.", error: null },
        { status: 400 }
      );
    }

    const results = await Promise.all(
      updates.map(
        (item: { id: string; order_index: number }) =>
          supabase
            .from("faqs")
            .update({ order_index: item.order_index })
            .eq("id", item.id)
            .eq("user_id", user.id) // explicit ownership check
      )
    );

    const firstError = results.find((res) => res.error)?.error;
    if (firstError) {
      console.error("Supabase reorder error:", firstError.message);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to reorder some FAQs",
          error: firstError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "FAQ order updated successfully",
      error: null,
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

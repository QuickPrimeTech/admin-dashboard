import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

async function createSupabaseServerClient() {
  const cookieStore = await cookies(); // ⬅️ await here

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
      },
    }
  );
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient(); // ⬅️ await here

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user || userError) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { updates } = await request.json();

    if (!Array.isArray(updates)) {
      return NextResponse.json(
        { success: false, message: "'updates' must be an array." },
        { status: 400 }
      );
    }

    const updatePromises = updates.map(
      (item: { id: string; order_index: number }) =>
        supabase
          .from("faqs")
          .update({ order_index: item.order_index })
          .eq("id", item.id)
          .eq("user_id", user.id) // Enforce RLS ownership
    );

    const results = await Promise.all(updatePromises);

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

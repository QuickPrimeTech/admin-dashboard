// /app/api/stats/route.ts
import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/helpers/common";

export async function GET() {
  const { user, response, supabase } = await getAuthenticatedUser();

  if (response) {
    return response;
  }

  try {
    const [menuRes, reservationsRes, eventsRes, galleryRes] = await Promise.all(
      [
        supabase
          .from("menu_items")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id),

        supabase
          .from("reservations")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("status", "pending"),

        supabase
          .from("private_events")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id),

        supabase
          .from("gallery")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id),
      ]
    );

    return NextResponse.json({
      success: true,
      data: {
        menu: menuRes.count ?? 0,
        reservations: reservationsRes.count ?? 0,
        events: eventsRes.count ?? 0,
        gallery: galleryRes.count ?? 0,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}

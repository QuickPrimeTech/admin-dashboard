// /app/api/stats/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = await createClient();

  try {
    const [menuRes, reservationsRes, eventsRes, galleryRes] = await Promise.all(
      [
        supabase
          .from("menu_items")
          .select("*", { count: "exact", head: true }),

        supabase
          .from("reservations")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending"),

        supabase
          .from("private_events")
          .select("*", { count: "exact", head: true }),

        supabase
          .from("gallery")
          .select("*", { count: "exact", head: true })
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

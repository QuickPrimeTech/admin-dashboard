// /app/api/stats/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

async function createSupabaseServerClient() {
  const cookieStore = await cookies();
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

export async function GET() {
  const supabase = await createSupabaseServerClient();

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

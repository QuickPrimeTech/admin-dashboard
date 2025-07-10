// app/api/restaurant-settings/route.ts
import { NextRequest, NextResponse } from "next/server";
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

// GET: fetch the restaurant settings (assumes only 1 row per user)
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

  const { data, error } = await supabase
    .from("restaurant_settings")
    .select("*")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, data });
}

// POST: insert initial settings row for the user
export async function POST(req: NextRequest) {
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
    const settings = await req.json();

    const { data: existing } = await supabase
      .from("restaurant_settings")
      .select("id")
      .eq("user_id", user.id)
      .limit(1)
      .single();

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Settings already exist for this user" },
        { status: 409 }
      );
    }

    const { error } = await supabase
      .from("restaurant_settings")
      .insert([{ ...settings, user_id: user.id }]);

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Settings created successfully",
    });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// PATCH: update the settings row for the authenticated user
export async function PATCH(req: NextRequest) {
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
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID is required for update" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("restaurant_settings")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
    });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

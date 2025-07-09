import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/server/supabase";

// GET: fetch the restaurant settings (assumes only 1 row)
export async function GET() {
  const { data, error } = await supabase
    .from("restaurant_settings")
    .select("*")
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

// POST: insert initial settings (optional - usually used once)

// PATCH: update the single settings row
export async function PATCH(req: NextRequest) {
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
      .eq("id", id);

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

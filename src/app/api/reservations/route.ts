// app/api/reservations/route.ts
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
    .from("reservations")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch reservations",
        error: error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, data });
}

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

  const body = await req.json();
  const {
    name,
    email,
    phone,
    date,
    time,
    guests,
    status = "pending",
    notes,
  } = body;

  if (!name || !email || !phone || !date || !time || !guests) {
    return NextResponse.json(
      { success: false, message: "Missing required fields" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase.from("reservations").insert([
    {
      name,
      email,
      phone,
      date,
      time,
      guests,
      status,
      notes,
      user_id: user.id,
    },
  ]);

  if (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create reservation",
        error: error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Reservation created",
    data,
  });
}

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

  const body = await req.json();
  const { id, ...fieldsToUpdate } = body;

  if (!id) {
    return NextResponse.json(
      { success: false, message: "Missing reservation ID" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("reservations")
    .update(fieldsToUpdate)
    .eq("id", id)
    .eq("user_id", user.id)
    .select();

  if (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update reservation",
        error: error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Reservation updated",
    data,
  });
}

export async function DELETE(req: NextRequest) {
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

  const body = await req.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json(
      { success: false, message: "Missing reservation ID" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("reservations")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete reservation",
        error: error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, message: "Reservation deleted" });
}

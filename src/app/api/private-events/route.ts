import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET: Fetch all private events
export async function GET() {
  const { data, error } = await supabase
    .from("private_events")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch private events",
        error: error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, data });
}

// POST: Create a new private event
export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    name,
    email,
    phone,
    event_date,
    event_type,
    guests,
    notes,
    status = "pending",
  } = body;

  if (!name || !email || !phone || !event_date || !event_type || !guests) {
    return NextResponse.json(
      { success: false, message: "Missing required fields" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase.from("private_events").insert([
    {
      name,
      email,
      phone,
      event_date,
      event_type,
      guests,
      notes,
      status,
    },
  ]);

  if (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create private event",
        error: error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Private event created",
    data,
  });
}

// PATCH: Update a private event (status or other fields)
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, ...fieldsToUpdate } = body;

  if (!id) {
    return NextResponse.json(
      { success: false, message: "Missing event ID" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("private_events")
    .update(fieldsToUpdate)
    .eq("id", id)
    .select();

  if (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update private event",
        error: error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Private event updated",
    data,
  });
}

// DELETE: Remove a private event
export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json(
      { success: false, message: "Missing event ID" },
      { status: 400 }
    );
  }

  const { error } = await supabase.from("private_events").delete().eq("id", id);

  if (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete private event",
        error: error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Private event deleted",
  });
}

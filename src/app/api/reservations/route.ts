// app/api/reservations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/server/supabase";

// Schema (for reference)
/*
interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  status: string;
  notes?: string;
  created_at: string;
}
*/

// GET: fetch all reservations
export async function GET() {
  const { data, error } = await supabase.from("reservations").select("*");

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

// POST: create a new reservation
export async function POST(req: NextRequest) {
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

// PATCH: update reservation status or other fields
export async function PATCH(req: NextRequest) {
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

// DELETE: remove a reservation
export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json(
      { success: false, message: "Missing reservation ID" },
      { status: 400 }
    );
  }

  const { error } = await supabase.from("reservations").delete().eq("id", id);

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

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  console.log(
    "Using SUPABASE_SERVICE_ROLE_KEY:",
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    const body = await req.json();
    const { restaurantName, email, password } = body;

    if (!restaurantName || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // ✅ Log inputs
    console.log("Creating user with email:", email);

    // Create user
    const { data: user, error: userError } =
      await supabase.auth.admin.createUser({
        email,
      });

    if (userError) {
      console.error("CreateUser error:", userError);
      return NextResponse.json(
        { error: "Supabase Auth error", details: userError.message },
        { status: 500 }
      );
    }

    const uid = user.user.id;

    const { error: insertError } = await supabase.from("restaurants").insert({
      id: uid,
      restaurant_name: restaurantName,
      email,
      password, // optionally hash later
    });

    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json(
        { error: "DB insert error", details: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Restaurant created successfully", id: uid },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Unexpected server error", details: error.message },
      { status: 500 }
    );
  }
}

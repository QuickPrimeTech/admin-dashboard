// app/api/gallery/publish/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/helpers/common";

export async function PATCH(req: NextRequest) {
  //checking if the user is authenticated
  const { user, supabase, response } = await getAuthenticatedUser();
  if (!user) return response;

  try {
    const { id, is_published } = await req.json();

    if (typeof id !== "number" || typeof is_published !== "boolean") {
      return NextResponse.json(
        { success: false, message: "Invalid payload" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("gallery")
      .update({ is_published })
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
      message: "Publish status updated successfully",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

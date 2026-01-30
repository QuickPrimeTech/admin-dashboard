import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server"; // or your supabase client
import { getCurrentBranchId } from "@/helpers/common";

export async function PATCH(request: Request) {
  // Create a Supabase instance
  const supabase = await createClient();

  //Get the current branch id
  const branchId = await getCurrentBranchId();

  try {
    const body = await request.json();
    // Update branch_settings table (or your table name)
    const { data, error } = await supabase
      .from("branch_settings")
      .update({
        name: body.name,
        is_open: body.is_open,
        opening_hours: body.opening_hours, // JSONB array
      })
      .eq("id", branchId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { error: error.message || "Failed to update settings" },
      { status: 500 },
    );
  }
}

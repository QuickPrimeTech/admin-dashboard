import { ApiResponse, createResponse } from "@/helpers/api-responses";
import { Restaurant } from "@/types/onboarding";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiResponse<Restaurant>>> {
  const supabase = await createClient();

  //  Read restaurant name from request
  const restaurantName = await req.text();

  //  Get current authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return createResponse(401, "Unauthorized");
  }

  // Insert or update restaurant for the user
  const { data, error } = await supabase
    .from("restaurants")
    .upsert(
      {
        name: restaurantName,
        user_id: user.id, // required for conflict resolution
      },
      {
        onConflict: "user_id", // means if same user_id exists, update
      }
    )
    .select()
    .single();

  if (error) {
    console.error("Supabase error:", error.message);
    return createResponse(500, "Failed to save restaurant name");
  }

  return createResponse<Restaurant>(
    200,
    "Your restaurant name has been successfully saved",
    data
  );
}

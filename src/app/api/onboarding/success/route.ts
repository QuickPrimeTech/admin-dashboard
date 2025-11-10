import { ApiResponse, createResponse } from "@/helpers/api-responses";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(): Promise<NextResponse<ApiResponse<boolean>>> {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    data: { has_onboarded: true },
  });

  if (error) {
    return createResponse(502, "There was an error onboarding you");
  }
  return createResponse(200, "You have been successfully onboarded", true);
}

// app/api/settings/route.ts
import { createClient } from "@/utils/supabase/server";
import { getCurrentBranchId } from "@/helpers/common";
import { createResponse } from "@/helpers/api-responses";

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const branchId = await getCurrentBranchId();

  if (!branchId) {
    return createResponse(401, "No branch selected");
  }

  try {
    const body = await request.json();

    // Remove undefined values to avoid overwriting existing data with null
    const updateData = Object.fromEntries(
      Object.entries(body).filter(([_, v]) => v !== undefined),
    );

    const { data, error } = await supabase
      .from("branch_settings")
      .update(updateData)
      .eq("id", branchId)
      .select()
      .single();

    if (error) throw error;

    return createResponse(
      200,
      "Successfully updated branch settings information",
      data,
    );
  } catch (error: unknown) {
    console.error("Settings update error:", error);

    const message =
      error instanceof Error ? error.message : "Failed to update settings";

    return createResponse(500, message);
  }
}

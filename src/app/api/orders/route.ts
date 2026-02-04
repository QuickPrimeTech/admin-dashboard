import { createResponse } from "@/helpers/api-responses";
import { getCurrentBranchId } from "@/helpers/common";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  // Checking if the user is authenticated
  const supabase = await createClient();

  //Getting the branchId
  const branchId = await getCurrentBranchId();

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("branch_id", branchId)
    .eq("status", "success")
    .order("created_at", { ascending: false });

  if (error) {
    return createResponse(502, error.message || "Failed to fetch orders");
  }

  //  data is an array of Order, so cast to Order[]
  return createResponse(200, "Orders fetched successfully", data);
}

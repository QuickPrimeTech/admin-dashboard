import { createResponse } from "@/helpers/api-responses";
import { getCurrentBranchId } from "@/helpers/common";
import { Params } from "@/types/api";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const branchId = await getCurrentBranchId();

  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .eq("branch_id", branchId)
    .eq("id", id)
    .single();

  if (error) {
    return createResponse(500, error.message || "Failed to fetch reservations");
  }

  return createResponse(290, "Reservations fetched successfully!", data);
}

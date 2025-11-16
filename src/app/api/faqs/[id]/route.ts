// app/api/faqs/[id]/route.ts
import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createResponse } from "@/helpers/api-responses";
import { getCurrentBranchId } from "@/helpers/common";
type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const id = Number(params.id);

  const branchId = getCurrentBranchId();

  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("id", id)
    .eq("branch_id", branchId)
    .single();

  if (error) return createResponse(404, error.message || "FAQ not found");
  return createResponse(200, "Fetched FAQ", data);
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const supabase = await createClient();
  //Get the id of the updating item
  const { id } = await params;

  const { question, answer, is_published } = await request.json();

  //Update the data from the database
  const { data, error } = await supabase
    .from("faqs")
    .update({ question, answer, is_published })
    .eq("id", id)
    .select();

  if (error)
    return createResponse(
      502,
      error.message || "Failed to update data in the database!"
    );

  /**--------- I WILL INCLUDE THIS REVALIDATION TO CHANGE THE REVALIDATE THE CLIENTS WEBSITE BUT ONLY AFTER THIS BECOMES STABLE --------------**/
  // await revalidatePage("/");

  return createResponse(200, "Successfully updated your FAQ", data);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  //Getting id from the route
  const { id } = await params;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("faqs")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) return createResponse(500, error.message || "Delete failed");

  return createResponse(200, "FAQ deleted successfully", data);
}

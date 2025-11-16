// @/app/api/faqs/route.ts
import { NextRequest } from "next/server";
import {
  getAuthenticatedUser,
  errorResponse,
  successResponse,
  getCurrentBranchId,
} from "@/helpers/common";
import { revalidatePage } from "@/helpers/revalidator";
import { createClient } from "@/utils/supabase/server";
import { createResponse } from "@/helpers/api-responses";

export async function GET() {
  const supabase = await createClient();

  const branchId = await getCurrentBranchId();

  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .order("order_index", { ascending: false })
    .eq("branch_id", branchId);

  if (error)
    return createResponse(500, error.message || "Failed to fetch FAQs");

  return createResponse(200, "Fetched all faqs successfully", data);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { question, answer, is_published } = await request.json();

  if (!question || !answer) {
    return errorResponse("Missing fields", 400);
  }

  const branchId = await getCurrentBranchId();

  // FIXED: Only look at FAQs for this branch
  const { data: maxOrderFaq } = await supabase
    .from("faqs")
    .select("order_index")
    .eq("branch_id", branchId)
    .order("order_index", { ascending: false })
    .limit(1)
    .single();

  const newOrderIndex =
    maxOrderFaq?.order_index != null ? maxOrderFaq.order_index + 1 : 0;

  const { data, error } = await supabase
    .from("faqs")
    .insert([
      {
        question,
        answer,
        is_published: is_published ?? true,
        order_index: newOrderIndex,
        branch_id: branchId,
      },
    ])
    .select()
    .single();

  if (error) return createResponse(502, error.message || "Insert failed");

  // await revalidatePage("/");
  return createResponse(200, "The Faq was successfully created", data);
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();

  const { id, question, answer, is_published, order_index } =
    await request.json();

  if (!id) return errorResponse("Missing ID", 400);

  //Update the data from the database
  const { data, error } = await supabase
    .from("faqs")
    .update({ question, answer, is_published, order_index })
    .eq("id", id)
    .select();

  if (error)
    return createResponse(
      502,
      error.message || "Failed to update data in the database!"
    );

  /**--------- I WILL INCLUDE THIS REVALIDATION TO CHANGE THE REVALIDATE THE CLIENTS WEBSITE BUT ONLY AFTER THIS BECOMES STABLE --------------**/
  // await revalidatePage("/");

  return createResponse(200, `Successfully created your FAQ`, data);
}

export async function DELETE(request: NextRequest) {
  const { user, supabase, response } = await getAuthenticatedUser();
  if (!user) return response;

  const { id } = await request.json();

  if (!id) return errorResponse("Missing ID", 400);

  const { error } = await supabase
    .from("faqs")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return errorResponse("Delete failed", 500, error.message);
  await revalidatePage("/");
  return successResponse("Deleted");
}

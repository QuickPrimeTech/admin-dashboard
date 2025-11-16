// @/app/api/faqs/route.ts
import { NextRequest } from "next/server";
import { getCurrentBranchId } from "@/helpers/common";
import { createClient } from "@/utils/supabase/server";
import { createResponse } from "@/helpers/api-responses";

export async function GET() {
  const supabase = await createClient();

  const branchId = await getCurrentBranchId();

  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .order("order_index", { ascending: true })
    .eq("branch_id", branchId);

  if (error)
    return createResponse(500, error.message || "Failed to fetch FAQs");

  return createResponse(200, "Fetched all faqs successfully", data);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { question, answer, is_published } = await request.json();

  if (!question || !answer) {
    return createResponse(403, "Please fill all the fields before submitting!");
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

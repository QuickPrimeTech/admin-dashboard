// @/app/api/faqs/route.ts
import { NextRequest } from "next/server";
import {
  getAuthenticatedUser,
  errorResponse,
  successResponse,
} from "@/helpers/common";
import { revalidatePage } from "@/helpers/revalidator";

export async function GET() {
  const { user, supabase, response } = await getAuthenticatedUser();
  if (!user) return response;

  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("user_id", user.id)
    .order("order_index", { ascending: false });

  if (error) return errorResponse("Failed to fetch FAQs", 500, error.message);

  return successResponse("Fetched successfully", data);
}

export async function POST(request: NextRequest) {
  const { user, supabase, response } = await getAuthenticatedUser();
  if (!user) return response;

  const { question, answer, is_published } = await request.json();

  if (!question || !answer) {
    return errorResponse("Missing fields", 400);
  }

  const { data: maxOrderFaq } = await supabase
    .from("faqs")
    .select("order_index")
    .eq("user_id", user.id)
    .order("order_index", { ascending: false })
    .limit(1)
    .single();

  const newOrderIndex =
    maxOrderFaq?.order_index != null ? maxOrderFaq.order_index + 1 : 0;

  const { data, error } = await supabase.from("faqs").insert([
    {
      question,
      answer,
      is_published: is_published ?? true,
      order_index: newOrderIndex,
      user_id: user.id,
    },
  ]);

  if (error) return errorResponse("Insert failed", 500, error.message);
  await revalidatePage("/");
  return successResponse("The Faq was successfully created");
}

export async function PATCH(request: NextRequest) {
  const { user, supabase, response } = await getAuthenticatedUser();
  if (!user) return response;

  const { id, question, answer, is_published, order_index } =
    await request.json();

  if (!id) return errorResponse("Missing ID", 400);

  const { data, error } = await supabase
    .from("faqs")
    .update({ question, answer, is_published, order_index })
    .eq("id", id)
    .eq("user_id", user.id)
    .select();

  if (error) return errorResponse("Update failed", 500, error.message);
  await revalidatePage("/");
  return successResponse("Updated", data);
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

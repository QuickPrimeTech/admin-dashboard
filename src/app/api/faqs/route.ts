import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
      },
    }
  );
}

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("user_id", user.id)
    .order("order_index", { ascending: false });

  if (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch FAQs", error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Fetched successfully",
    data,
  });
}

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { question, answer, is_published } = await request.json();

  if (!question || !answer) {
    return NextResponse.json(
      { success: false, message: "Missing fields" },
      { status: 400 }
    );
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

  if (error) {
    return NextResponse.json(
      { success: false, message: "Insert failed", error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, message: "Inserted", data });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id, question, answer, is_published, order_index } =
    await request.json();

  if (!id) {
    return NextResponse.json(
      { success: false, message: "Missing ID" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("faqs")
    .update({ question, answer, is_published, order_index })
    .eq("id", id)
    .eq("user_id", user.id)
    .select();

  if (error) {
    return NextResponse.json(
      { success: false, message: "Update failed", error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, message: "Updated", data });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await request.json();

  if (!id) {
    return NextResponse.json(
      { success: false, message: "Missing ID" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("faqs")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json(
      { success: false, message: "Delete failed", error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, message: "Deleted" });
}

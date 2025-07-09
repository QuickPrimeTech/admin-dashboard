// app/api/faqs/route.ts
import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/lib/server/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .order("order_index", { ascending: false });

  if (error) {
    console.error("Failed to fetch FAQs:", error.message);
    return NextResponse.json(
      { success: false, message: "Failed to fetch FAQs", error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "FAQs fetched successfully",
    data,
  });
}
// app/api/faqs/route.ts

// Define the FAQ interface

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { question, answer, is_published } = body;

    if (!question || !answer) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: question, answer, order_index",
        },
        { status: 400 }
      );
    }
    const { data: maxOrderFaq } = await supabase
      .from("faqs")
      .select("order_index")
      .order("order_index", { ascending: false })
      .limit(1)
      .single();

    const newOrderIndex =
      maxOrderFaq?.order_index != null ? maxOrderFaq.order_index + 1 : 0;

    const { data, error } = await supabase.from("faqs").insert([
      {
        question,
        answer,
        order_index: newOrderIndex,
        is_published: is_published ?? true,
      },
    ]);

    if (error) {
      console.error("Supabase insert error:", error.message);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to insert FAQ",
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "FAQ created successfully",
      data,
    });
  } catch (err) {
    const error = err as Error;
    console.error("Unexpected server error:", error.message);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

// PATCH = update an existing FAQ
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    const { id, question, answer, order_index, is_published } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "FAQ ID is required for update" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("faqs")
      .update({
        question,
        answer,
        order_index,
        is_published,
      })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Supabase update error:", error.message);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update FAQ",
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "FAQ updated successfully",
      data,
    });
  } catch (err) {
    const error = err as Error;
    console.error("Unexpected server error:", error.message);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
// DELETE = remove an FAQ by ID
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "FAQ ID is required for deletion" },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("faqs").delete().eq("id", id);

    if (error) {
      console.error("Supabase delete error:", error.message);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to delete FAQ",
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "FAQ deleted successfully",
    });
  } catch (err) {
    const error = err as Error;
    console.error("Unexpected server error:", error.message);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { cleanFormData } from "@/lib/clean-form-data";
import { APIResponse } from "@/types/api";

export async function POST(request: NextRequest): Promise<APIResponse> {
  const formData = await request.formData();

  const data = cleanFormData(formData);

  console.log("Received form data:", data);

  return NextResponse.json({
    success: true,
    message: "Data received and cleaned",
  });
}

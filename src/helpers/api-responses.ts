// @/helpers/api-responses.ts

import { ApiResponse } from "@/types/api";
import { NextResponse } from "next/server";

export function createResponse<T>(
  status: number,
  message: string,
  data?: T,
  success?: boolean,
): NextResponse<ApiResponse<T | null>> {
  // Success is either explicitly passed OR inferred from status
  const isSuccess = success ?? (status >= 200 && status < 300);

  return NextResponse.json({ message, data: data ?? null, success: isSuccess }, { status });
}

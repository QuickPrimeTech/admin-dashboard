// @/helpers/api-responses.ts

import { NextResponse } from "next/server";

export interface ApiResponse<T> {
  message: string;
  data: T | null;
  success: boolean;
}

// --- Helper to create responses ---
export function createResponse<T>(
  status: number,
  message: string,
  data: T | null = null,
  success?: boolean
): NextResponse<ApiResponse<T>> {
  // ✅ If success isn’t explicitly provided, infer from whether data exists
  const isSuccess = success ?? Boolean(data);

  return NextResponse.json({ message, data, success: isSuccess }, { status });
}

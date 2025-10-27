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
  success = true
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ message, data, success }, { status });
}

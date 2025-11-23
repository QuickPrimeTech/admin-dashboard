// @/helpers/api-responses.ts

import { NextResponse } from "next/server";

export interface ApiResponse<T> {
  message: string;
  data: T | null;
  success: boolean;
}

export function createResponse<T>(
  status: number,
  message: string,
  data: T | null = null,
  success?: boolean
): NextResponse<ApiResponse<T>> {
  // Success is either explicitly passed OR inferred from status
  const isSuccess = success ?? (status >= 200 && status < 300);

  return NextResponse.json({ message, data, success: isSuccess }, { status });
}

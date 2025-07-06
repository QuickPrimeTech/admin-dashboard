import { NextResponse } from "next/server";

export type APIResponse = NextResponse<{
  success: boolean;
  message: string;
}>;

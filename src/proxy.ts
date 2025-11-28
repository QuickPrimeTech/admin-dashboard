// middleware.ts
import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function proxy(request: NextRequest) {
  //  Continue with session update middleware
  console.log("------------------middleware is running-------------------");
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Apply to everything except static/image assets
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

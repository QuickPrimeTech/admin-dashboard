// app/api/invite-token/validate/route.ts
import { NextResponse } from "next/server";
import { isAfter } from "date-fns";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: Request) {

  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      {
        valid: false,
        error:
          "This is not a valid link. Please request another one from the QuickPrimeTech",
      },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("invite_tokens")
    .select("*")
    .eq("token", token)
    .single();

  if (error || !data) {
    return NextResponse.json(
      {
        valid: false,
        error:
          "This is not a valid link. Please request another one from QuickPrimeTech",
      },
      { status: 404 }
    );
  }

  const expired = isAfter(new Date(), new Date(data.expires_at));
  if (expired) {
    return NextResponse.json(
      {
        valid: false,
        error:
          "The link has expired. Please request a link from QuickPrimeTech",
      },
      { status: 403 }
    );
  }

  return NextResponse.json({ valid: true });
}

import { NextResponse } from "next/server";
import { supabase } from "@/lib/server/supabase"; // your supabase client helper
import crypto from "crypto";

export async function POST() {
  // Generate secure random token
  const token = crypto.randomBytes(32).toString("hex");

  // Set expiration date (e.g. 24 hours from now)
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  const { error } = await supabase.from("invite_tokens").insert({
    token,
    expires_at: expiresAt,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Create the one-time link URL
  const inviteUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/invite-user?token=${token}`;

  return NextResponse.json({ inviteUrl });
}

// /helpers/revalidator.ts
import { getAuthenticatedUser } from "@/helpers/common";
import { NextResponse } from "next/server";

export async function revalidatePage(path: string) {
  try {
    // 1. Ensure the user is authenticated
    const { user, supabase, response } = await getAuthenticatedUser();
    if (response) return response; // early return if not authenticated
    // 2. Fetch the restaurant website for this user
    const { data, error } = await supabase
      .from("restaurant_settings")
      .select("website")
      .eq("user_id", user.id)
      .single();

    if (error || !data?.website) {
      return NextResponse.json({
        status: 404,
        message: "failed to update your website",
      });
      // throw new Error("Restaurant website not found for this user.");
    }

    const website = data.website;
    const revalidateSecret = process.env.REVALIDATE_SECRET;

    if (!revalidateSecret) {
      throw new Error("Missing REVALIDATE_SECRET in environment variables.");
    }

    // 3. Call the restaurant site’s /api/revalidate endpoint
    const res = await fetch(`${website}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        path,
        secret: revalidateSecret,
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(
        `Revalidation failed: ${res.status} ${res.statusText} - ${
          body.message || ""
        }`
      );
    }

    return await res.json();
  } catch (err) {
    console.error("Error in revalidatePage:", err);
    throw err;
  }
}

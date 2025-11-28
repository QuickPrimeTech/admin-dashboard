import { createClient } from "@/utils/supabase/server";
import axios from "axios";

export async function revalidatePage(path: string) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("restaurants")
      .select("website")
      .single();

    if (error || !data?.website) {
      console.error("Restaurant website not found for this user.");
      return null;
    }

    const website = data.website;
    const revalidateSecret = process.env.REVALIDATE_SECRET;

    if (!revalidateSecret) {
      console.error("Missing REVALIDATE_SECRET in environment variables.");
      return null;
    }

    // 3. Call the restaurant site's /api/revalidate endpoint
    const { data: res } = await axios.post(`${website}/api/revalidate`, {
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
      console.error(
        `Revalidation failed: ${res.status} ${res.statusText} - ${
          body.message || ""
        }`
      );
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error("Error in revalidatePage:", err);
    return null;
  }
}

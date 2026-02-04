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
      console.error("Restaurant website not found:", JSON.stringify(error));
      return null;
    }

    const website = data.website;
    const revalidateSecret = process.env.REVALIDATE_SECRET;

    if (!revalidateSecret) {
      console.error("Missing REVALIDATE_SECRET.");
      return null;
    }

    // ✅ Axios call (correct)
    const res = await axios.post(
      `${website}/api/revalidate`,
      {
        path,
        secret: revalidateSecret,
      },
      {
        headers: { "Content-Type": "application/json" },
      },
    );

    return res.data;
  } catch (err: any) {
    // 🔥 THIS logs the error returned from the other site's API
    if (axios.isAxiosError(err)) {
      console.error("Revalidation API Error:");
      console.error("Status:", err.response?.status);
      console.error("Response:", JSON.stringify(err.response?.data));
    } else {
      console.error("Unexpected error:", JSON.stringify(err));
    }

    return null;
  }
}

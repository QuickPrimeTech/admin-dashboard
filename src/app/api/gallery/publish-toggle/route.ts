// app/api/gallery/publish/route.ts
import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createResponse } from "@/helpers/api-responses";

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();

  const { id, is_published } = await req.json();

  if (typeof id !== "number" || typeof is_published !== "boolean") {
    return createResponse(400, "Invalid payload");
  }

  //Updating the data in supabase to change to the type specified here.
  try {
    const { data, error } = await supabase
      .from("gallery")
      .update({ is_published })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return createResponse(500, error.message);
    }

    return createResponse(200, `${data.title ? data.title : "Your gallery photo"} has been ${is_published ? "published": "unpublished"} successfully`, data);
  } catch (err) {
    console.error(err);
    return createResponse(
      500,
      `An error occurred while trying to ${
        is_published ? "publish" : "unpublish"
      } the gallery photo`
    );
  }
}

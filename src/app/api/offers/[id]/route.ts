import { createResponse } from "@/helpers/api-responses";
import { deleteImageFromCloudinary } from "@/helpers/common";
import { Params } from "@/types/api";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

export async function DELETE(_request: NextRequest, { params }: Params) {
  //supabase instance
  const supabase = await createClient();
  //Getting the id from the params
  const { id } = await params;
  //Getting the public id for image
  const { data, error } = await supabase
    .from("offers")
    .delete()
    .eq("id", id)
    .select("public_id")
    .single();

  if (error) {
    return createResponse(
      502,
      error.message || "Failed to delete offer from the database!"
    );
  }
  //If there is a public id, delete the image from the storage

  if (data?.public_id) {
    await deleteImageFromCloudinary(data.public_id);
  }

  return createResponse(200, "Successfully deleted the offer!", data);
}

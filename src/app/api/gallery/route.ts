import { NextRequest } from "next/server";
import {
  getAuthenticatedUser,
  uploadImageToCloudinary,
  uploadAndReplaceImage,
  deleteImageFromCloudinary,
  errorResponse,
  successResponse,
  getSanitizedRestaurantName,
} from "@/helpers/common";
import { GalleryItemInsert, ServerGalleryItem } from "@/types/gallery";
import { revalidatePage } from "@/helpers/revalidator";
import { createClient } from "@/utils/supabase/server";
import { createResponse } from "@/helpers/api-responses";

export async function POST(req: NextRequest) {
  // checking if the user is authenticated
  const { user, supabase, response } = await getAuthenticatedUser();
  if (!user) return response;

  try {
    const formData = await req.formData();

    const title = formData.get("title") as string | null;
    const description = formData.get("description") as string | null;
    const is_published = formData.get("is_published") === "true";
    const file = formData.get("file") as File | null;
    const category = formData.get("category") as string;
    const lqip = formData.get("lqip") as string;

    if (!file) return createResponse(400, "No file uploaded");

    const sanitizedRestaurantName = await getSanitizedRestaurantName(user.id);

    //Uploading the image to cloudinary
    const uploadResult = await uploadImageToCloudinary(
      file,
      `${sanitizedRestaurantName}/gallery`
    );

    const galleryItem: GalleryItemInsert = {
      title: title || null,
      description: description || null,
      is_published,
      category,
      lqip,
      image_url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      user_id: user.id,
    };

    //Inserting the item to the database
    const { data, error: supabaseError } = await supabase
      .from("gallery")
      .insert(galleryItem)
      .select()
      .single();

    if (supabaseError) return createResponse(500, supabaseError.message);

    return createResponse<ServerGalleryItem>(
      200,
      "Image uploaded to successfully",
      data
    );
  } catch (error) {
    return createResponse(
      500,
      "An error occurred while uploading your gallery item"
    );
  }
}

export async function GET() {
  //checking if the user is authenticated
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return createResponse(500, "Failed to fetch gallery items");

    return createResponse(
      200,
      "Successfully fetched all the gallery items",
      data
    );
  } catch (error) {
    return createResponse(
      500,
      "An error occurred while fetching your gallery items",
      error
    );
  }
}

export async function PATCH(req: NextRequest) {
  //checking if the user is authenticated
  const { user, supabase, response } = await getAuthenticatedUser();
  if (!user) return response;

  const formData = await req.formData();
  const id = formData.get("id") as string;
  const file = formData.get("file") as File | null;
  const title = formData.get("title") as string | null;
  const description = formData.get("description") as string | null;
  const is_published = formData.get("is_published") === "true";
  const category = formData.get("category") as string | null;

  const { data, error } = await supabase
    .from("gallery")
    .select("public_id")
    .eq("id", Number(id))
    .eq("user_id", user.id)
    .single();

  if (error)
    return errorResponse("Item not found or unauthorized", 404, error.message);

  let uploadedImageUrl = "";
  let publicId = data.public_id;
  if (file) {
    const sanitizedRestaurantName = await getSanitizedRestaurantName(user.id);
    const uploadResult = await uploadAndReplaceImage(
      file,
      `${sanitizedRestaurantName}/gallery`,
      publicId
    );
    uploadedImageUrl = uploadResult.secure_url;
    publicId = uploadResult.public_id;
  }

  const galleryItem = {
    title,
    description,
    is_published,
    category,
    ...(uploadedImageUrl && { image_url: uploadedImageUrl }),
    ...(publicId && { public_id: publicId }),
  };

  const { error: updateError } = await supabase
    .from("gallery")
    .update(galleryItem)
    .eq("id", parseInt(id))
    .eq("user_id", user.id);

  if (updateError)
    return errorResponse(
      "Failed to update gallery item",
      500,
      updateError.message
    );
  await revalidatePage("/gallery");
  return successResponse("Successfully updated your gallery photo.");
}

export async function DELETE(request: NextRequest) {
  const { user, supabase, response } = await getAuthenticatedUser();
  if (!user) return response;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) return errorResponse("Missing gallery item ID", 400);

  const { data: item, error: fetchError } = await supabase
    .from("gallery")
    .select("public_id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !item) {
    return errorResponse("Gallery item not found", 404, fetchError?.message);
  }

  if (item.public_id) {
    await deleteImageFromCloudinary(item.public_id);
  }

  const { error: deleteError } = await supabase
    .from("gallery")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (deleteError)
    return errorResponse(
      "Failed to delete gallery item",
      500,
      deleteError.message
    );
  await revalidatePage("/gallery");
  return successResponse("Gallery photo deleted successfully");
}

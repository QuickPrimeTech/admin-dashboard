import { NextRequest } from "next/server";
import {
  uploadImageToCloudinary,
  uploadAndReplaceImage,
  deleteImageFromCloudinary,
  errorResponse,
  successResponse,
  getSanitizedPath
} from "@/helpers/common";
import { GalleryItemInsert, GalleryItem } from "@/types/gallery";
import { createClient } from "@/utils/supabase/server";
import { createResponse } from "@/helpers/api-responses";

export async function POST(req: NextRequest) {
  // checking if the user is authenticated
  const supabase = await createClient();

  //Get the info of the current logged in user
  const {data: {user}, error: userError} = await supabase.auth.getUser();

  if(userError) {
    return createResponse(502, userError.message);
  }

  const branch_id = user?.user_metadata.branch_id;

  if (!branch_id)  return createResponse(502, "You should select a branch first before creating a gallery photo");

  try {
    const formData = await req.formData();

    const title = formData.get("title") as string | null;
    const description = formData.get("description") as string | null;
    const is_published = formData.get("is_published") === "true";
    const file = formData.get("file") as File | null;
    const category = formData.get("category") as string;
    const lqip = formData.get("lqip") as string;

    if (!file) return createResponse(400, "No file uploaded");

    const sanitizedRestaurantName = await getSanitizedPath();

    // --- Upload to Cloudinary safely ---
    let uploadResult;
    try {
      uploadResult = await uploadImageToCloudinary(
        file,
        `${sanitizedRestaurantName}/gallery`
      );
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      return createResponse(502, "Failed to upload image to Cloudinary");
    }

    // --- Validate upload result ---
    if (!uploadResult?.secure_url || !uploadResult?.public_id) {
      return createResponse(
        502,
        "Failed to upload image successfully. Please try again later or contact us"
      );
    }

    const galleryItem: GalleryItemInsert = {
      title: title || null,
      description: description || null,
      is_published,
      category,
      lqip,
      image_url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      branch_id
    };

    //Inserting the item to the database
    const { data, error: supabaseError } = await supabase
      .from("gallery")
      .insert(galleryItem)
      .select()
      .single();

    if (supabaseError) return createResponse(500, supabaseError.message);

    return createResponse<GalleryItem>(
      200,
      "Image uploaded to successfully",
      data
    );
  } catch {
    return createResponse(
      500,
      "An error occurred while uploading your gallery item"
    );
  }
}
export async function GET() {
  //checking if the user is authenticated
  const supabase = await createClient();

  const {data:{user}} = await supabase.auth.getUser();

  console.log(user);
const { data, error } = await supabase
  .rpc('get_user_branch'); // or a SELECT that uses the RLS function

  console.log("rpc data ---->",data, error);
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
  const supabase = await createClient();

  //Getting the data from the frontend
  const formData = await req.formData();
  const id = formData.get("id") as string;
  const file = formData.get("file") as File | null;
  const title = formData.get("title") as string | null;
  const description = formData.get("description") as string | null;
  const is_published = formData.get("is_published") === "true";
  const category = formData.get("category") as string | null;

  //If a file exists I want to replace the existing one with the incoming one
  if (file) {
    //Getting the public id of the image in order to replace it with the incoming one
    const { data, error } = await supabase
      .from("gallery")
      .select("public_id")
      .eq("id", Number(id))
      .single();

    if (error)
      return errorResponse(
        "Item not found or unauthorized",
        404,
        error.message
      );

    let uploadedImageUrl = "";
    let publicId = data.public_id;

    //Getting the restaurant name from the db
    const sanitizedRestaurantName = await getSanitizedPath();

    // ----- THIS PART NEEDS IMPROVEMENT - THE DATA SHOULD NOT BE UPDATED IN SUPABASE IF THE IMAGE ISN'T REPLACED ------
    //Replacing the incoming image from cloudinary with the incoming one
    const uploadResult = await uploadAndReplaceImage(
      file,
      `${sanitizedRestaurantName}/gallery`,
      publicId
    );

    //Updating the variables if the cloudinary succeeded
    uploadedImageUrl = uploadResult.secure_url;
    publicId = uploadResult.public_id;

    //------ I SHOULD LATER PUT A TRY CATCH BLOCK FOR THE CLOUDINARY UPLOAD FUNCTION TO MAKE SURE THE DATA DOESN'T GO TO SUPABASE IF THAT FAILS ----
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

    if (updateError)
      return errorResponse(
        "Failed to update gallery item",
        500,
        updateError.message
      );
    return successResponse("Successfully updated your gallery photo.");
  }
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();

  //Getting the search param for example /api/gallery?id=78
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) return errorResponse("Missing gallery item ID", 400);

  //Getting the public id for cloudinary to delete the image
  const { data: item, error: fetchError } = await supabase
    .from("gallery")
    .select("public_id")
    .eq("id", id)
    .select()
    .single();

  //If there was an error gettin the data from supabase, I will then throw an error
  if (fetchError || !item) {
    return createResponse(404, fetchError?.message || "Gallery item was not found in the database");
  }

  // Delete from Cloudinary first
  try {
    await deleteImageFromCloudinary(item.public_id);
  } catch {
    return createResponse(502, "Failed to delete image from Cloudinary");
  }

  //Deleting the record for the gallery image from supabase
  const { error: deleteError } = await supabase
    .from("gallery")
    .delete()
    .eq("id", id);

  if (deleteError) return createResponse(502, deleteError.message);

  //Returning success if nothing failed
  return createResponse(
    200,
    "Gallery Photo has been successfully deleted!",
    item
  );
}

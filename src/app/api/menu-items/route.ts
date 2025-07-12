// app/api/menu-items/route.ts
import { NextRequest } from "next/server";

import { cleanFormData } from "@/lib/clean-form-data";
import { cloudinary } from "@/lib/server/cloudinary";
import {
  getSanitizedRestaurantName,
  getAuthenticatedUser,
  uploadImageToCloudinary,
  uploadAndReplaceImage,
  getMenuItemById,
  errorResponse,
  successResponse,
} from "@/helpers/common";
import { FormDataFields } from "@/types/menu";

export async function POST(request: NextRequest) {
  // checking if the client is authenticated to add a menu item
  const { user, supabase, response } = await getAuthenticatedUser();
  if (response) return response;

  try {
    const formData = await request.formData();
    //making the form data match the shape of the table that is being inserted to
    const data = cleanFormData(formData) as unknown as FormDataFields;

    // declaring intial values in order to determine later if the image was sent to cloudinary
    let uploadedImageUrl = "";
    let publicId = "";

    //Getting the image file sent by the user
    const imageFile = formData.get("image") as File | null;
    if (!imageFile) {
      return errorResponse("Your menu item requires an image", 403);
    }

    // since the user exist we can fetch the restaurant name from supabase through the user.id
    const sanitizedRestaurantName = await getSanitizedRestaurantName(user.id);

    // preparing the image to upload to cloudinary
    const uploadResult = await uploadImageToCloudinary(
      imageFile,
      `${sanitizedRestaurantName}/menu-items`
    );

    uploadedImageUrl = uploadResult.secure_url;
    publicId = uploadResult.public_id;

    const newMenuItem = {
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      category: data.category,
      is_available: data.is_available === "true" || data.is_available === true,
      dietary_preference: data.dietary_preference || [],
      image_url: uploadedImageUrl,
      public_id: publicId,
      user_id: user.id,
    };

    const { error } = await supabase.from("menu_items").insert([newMenuItem]);

    if (error) {
      return errorResponse("Failed to save item", 500, error.message);
    }

    return successResponse("Menu item created successfully");
  } catch (err) {
    const error = err as Error;
    return errorResponse("Server error", 500, error.message);
  }
}

export async function GET() {
  // Checking if the user is authenticated
  const { user, supabase, response } = await getAuthenticatedUser();
  if (response) return response;

  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return errorResponse("Failed to fetch menu items", 500, error.message);
  }

  //  data is an array of MenuItem, so cast to MenuItem[]
  return successResponse("Menu items fetched successfully", data);
}

export async function PATCH(request: NextRequest) {
  // Checking if the user is authenticated
  const { user, supabase, response } = await getAuthenticatedUser();
  if (response) return response;

  const sanitizedRestaurantName = await getSanitizedRestaurantName(user.id);

  try {
    const formData = await request.formData();
    const data = cleanFormData(formData) as unknown as FormDataFields;
    const id = data.id;

    if (!id) {
      return errorResponse("Missing menu item ID", 400);
    }

    const { data: currentItem, error: fetchError } = await getMenuItemById(
      user.id,
      id
    );

    if (fetchError || !currentItem) {
      return errorResponse("Menu item not found", 404, fetchError?.message);
    }

    let uploadedImageUrl = data.image_url;
    let newPublicId = currentItem.public_id;
    const imageFile = formData.get("image") as File | null;

    if (imageFile) {
      const uploadResult = await uploadAndReplaceImage(
        imageFile,
        currentItem.public_id,
        `${sanitizedRestaurantName}/menu-items`
      );
      uploadedImageUrl = uploadResult.secure_url;
      newPublicId = uploadResult.public_id;
    }

    const updatedMenuItem = {
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      category: data.category,
      is_available: data.is_available === "true" || data.is_available === true,
      dietary_preference: data.dietary_preference || [],
      public_id: newPublicId,
      image_url: uploadedImageUrl,
    };

    const { error: updateError } = await supabase
      .from("menu_items")
      .update(updatedMenuItem)
      .eq("id", parseInt(id))
      .eq("user_id", user.id);

    if (updateError) {
      return errorResponse(
        "Failed to update menu item",
        500,
        updateError.message
      );
    }

    return successResponse("Menu item updated successfully");
  } catch (err) {
    const error = err as Error;
    return errorResponse("Server error", 500, error.message);
  }
}

export async function DELETE(request: NextRequest) {
  // Checking if the user is authenticated
  const { user, supabase, response } = await getAuthenticatedUser();
  if (response) return response;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return errorResponse("Missing menu item ID", 400);
    }

    const { data: item, error: fetchError } = await supabase
      .from("menu_items")
      .select("public_id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !item) {
      return errorResponse("Menu item not found", 404, fetchError?.message);
    }

    if (item.public_id) {
      await cloudinary.uploader.destroy(item.public_id);
    }

    const { error: deleteError } = await supabase
      .from("menu_items")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (deleteError) {
      return errorResponse(
        "Failed to delete menu item",
        500,
        deleteError.message
      );
    }

    return successResponse("Menu item deleted successfully");
  } catch (err) {
    const error = err as Error;
    return errorResponse("Server error", 500, error.message);
  }
}

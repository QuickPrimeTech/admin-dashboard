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
import { revalidatePage } from "@/helpers/revalidator";

export async function POST(request: NextRequest) {
  // checking if the client is authenticated to add a menu item
  const { user, supabase, response } = await getAuthenticatedUser();
  if (response) return response;

  try {
    const formData = await request.formData();
    //making the form data match the shape of the table that is being inserted to
    const data = cleanFormData(formData) as unknown as FormDataFields;

    // declaring intial values in order to determine later if the image was sent to cloudinary
    let uploadedImageUrl = null;
    let publicId = null;

    //Getting the image file sent by the user
    const imageFile = formData.get("image") as File | null;

    // since the user exist we can fetch the restaurant name from supabase through the user.id
    const sanitizedRestaurantName = await getSanitizedRestaurantName(user.id);

    if (imageFile) {
      // preparing the image to upload to cloudinary
      const uploadResult = await uploadImageToCloudinary(
        imageFile,
        `${sanitizedRestaurantName}/menu-items`
      );

      uploadedImageUrl = uploadResult.secure_url;
      publicId = uploadResult.public_id;
    }

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
    //revalidating the page in the frontend for the menu items to be rendered
    await revalidatePage("/menu");
    // returning a response to the frontend
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

export async function PATCH(req: NextRequest) {
  const { user, supabase, response } = await getAuthenticatedUser();
  if (response) return response;

  const formData = await req.formData();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = formData.get("price") as string;
  const category = formData.get("category") as string;
  const imageFile = formData.get("image") as File | null;
  const menuId = formData.get("id") as string;

  if (!menuId) {
    return errorResponse("Missing menu item ID", 400);
  }

  // 1️⃣ Get current menu item
  const { data: currentItem, error } = await getMenuItemById(user.id, menuId);
  if (error || !currentItem) return errorResponse("Item not found", 404);

  let imageUrl = currentItem.image_url;
  let publicId = currentItem.public_id;

  // 2️⃣ If a new image is uploaded
  if (imageFile && imageFile.size > 0) {
    // Only delete existing Cloudinary image if it exists
    const folderPath = `restaurants/${user.id}/menu-items`;

    const uploadResult = await uploadAndReplaceImage(
      imageFile,
      folderPath,
      publicId || undefined // this line makes it null-safe
    );

    imageUrl = uploadResult.secure_url;
    publicId = uploadResult.public_id;
  }

  // 3️⃣ Update Supabase row
  const { error: updateError } = await supabase
    .from("menu_items")
    .update({
      name,
      description,
      price,
      category,
      image_url: imageUrl ?? null, // safe assignment
      public_id: publicId ?? null, // safe assignment
    })
    .eq("id", menuId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (updateError)
    return errorResponse("Error updating menu item", 500, updateError.message);
  //revalidating the page in the frontend for the menu items to be rendered
  await revalidatePage("/menu");
  //  returning a success message to the frontend
  return successResponse("Menu item updated successfully");
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
    //revalidating the page in the frontend for the menu items to be rendered
    await revalidatePage("/menu");
    //  returning a success message to the frontend
    return successResponse("Menu item deleted successfully");
  } catch (err) {
    const error = err as Error;
    return errorResponse("Server error", 500, error.message);
  }
}

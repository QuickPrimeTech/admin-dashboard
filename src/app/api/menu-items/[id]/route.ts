import { createResponse } from "@/helpers/api-responses";
import {
  deleteImageFromCloudinary,
  getMenuItemById,
  getSanitizedPath,
  uploadAndReplaceImage,
} from "@/helpers/common";
import { MenuItemFormData, menuItemSchema } from "@/schemas/menu";
import { Params } from "@/types/api";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

export async function PATCH(request: NextRequest, { params }: Params) {
  const supabase = await createClient();
  try {
    const formData = await request.formData();
    const { id } = await params;

    if (!id) {
      return createResponse(400, "Missing menu item ID", null, false);
    }

    // Fetch existing item
    const { data: existingItem, error: fetchError } = await getMenuItemById(id);
    if (fetchError || !existingItem) {
      return createResponse(
        404,
        "Menu item not found",
        fetchError?.message ?? null,
        false
      );
    }

    // Parse JSON choices
    const choicesEntry = formData.get("choices");
    let choices: unknown[] = [];
    if (typeof choicesEntry === "string") {
      try {
        choices = JSON.parse(choicesEntry);
      } catch {
        choices = [];
      }
    }

    // Build partial update
    const data: Partial<MenuItemFormData> = {
      name: formData.get("name") ?? existingItem.name,
      description: formData.get("description") ?? existingItem.description,
      price: formData.get("price")
        ? Number(formData.get("price"))
        : existingItem.price,
      category: formData.get("category") ?? existingItem.category,
      is_available:
        formData.get("is_available") !== null
          ? formData.get("is_available") === "true"
          : existingItem.is_available,
      is_popular:
        formData.get("is_popular") !== null
          ? formData.get("is_popular") === "true"
          : existingItem.is_popular,
      lqip: formData.get("lqip") ?? existingItem.lqip,
      start_time:
        formData.get("start_time") ??
        (existingItem.start_time ? existingItem.start_time.slice(0, 5) : null),
      end_time:
        formData.get("end_time") ??
        (existingItem.end_time ? existingItem.end_time.slice(0, 5) : null),

      choices: choices.length ? choices : existingItem.choices,
    };

    // Validate
    const parsed = menuItemSchema.partial().safeParse(data);
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return createResponse(400, "Invalid form data", errors, false);
    }

    // Handle image
    const imageFile = formData.get("image") as File | null;
    const isRemoveRequest =
      typeof formData.get("image") === "string" && formData.get("image") === "";

    let uploadedImageUrl = existingItem.image_url;
    let publicId = existingItem.public_id;

    // 🧩 Case 1: Upload new image
    if (imageFile && imageFile.size > 0) {
      const sanitizedRestaurantName = await getSanitizedPath();
      const uploadResult = await uploadAndReplaceImage(
        imageFile,
        `${sanitizedRestaurantName}/menu-items`,
        existingItem.public_id
      );
      uploadedImageUrl = uploadResult.secure_url;
      publicId = uploadResult.public_id;
    }

    // 🧩 Case 2: Remove image explicitly
    else if (isRemoveRequest && existingItem.public_id) {
      await deleteImageFromCloudinary(existingItem.public_id);
      uploadedImageUrl = null;
      publicId = null;
      data.lqip = null; // ✅ clear LQIP if image removed
    }

    const updatePayload = {
      ...data,
      image_url: uploadedImageUrl,
      public_id: publicId,
    };

    // Update in Supabase
    const { data: updatedItem, error: updateError } = await supabase
      .from("menu_items")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      return createResponse(
        500,
        "Failed to update menu item",
        updateError.message,
        false
      );
    }

    // await revalidatePage("/menu");
    return createResponse(
      200,
      "Menu item updated successfully",
      updatedItem,
      true
    );
  } catch (err) {
    const error = err as Error;
    return createResponse(
      500,
      "An error occurred while updating menu item",
      error.message,
      false
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  // Checking if the user is authenticated
  const supabase = await createClient();

  try {
    const { id } = await params;

    if (!id) {
      return createResponse(400, "Missing menu item ID");
    }

    const { data: item, error: fetchError } = await supabase
      .from("menu_items")
      .select("public_id")
      .eq("id", id)
      .single();

    if (fetchError || !item) {
      return createResponse(404, fetchError?.message || "Menu item not found");
    }

    if (item.public_id) {
      await deleteImageFromCloudinary(item.public_id);
    }

    const { data, error: deleteError } = await supabase
      .from("menu_items")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (deleteError) {
      return createResponse(502, "Failed to delete menu item");
    }
    //revalidating the page in the frontend for the menu items to be rendered
    // await revalidatePage("/menu");
    //  returning a success message to the frontend
    return createResponse(
      200,
      `${data.name} deleted successfully from the menu`,
      data
    );
  } catch {
    return createResponse(
      500,
      "An error occurred on the server while deleting your menu item"
    );
  }
}

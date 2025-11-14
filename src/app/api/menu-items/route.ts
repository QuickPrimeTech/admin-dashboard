// app/api/menu-items/route.ts
import { NextRequest } from "next/server";

import {
  getSanitizedPath,
  getAuthenticatedUser,
  uploadImageToCloudinary,
  uploadAndReplaceImage,
  getMenuItemById,
  deleteImageFromCloudinary,
  getCurrentBranchId,
} from "@/helpers/common";
import { revalidatePage } from "@/helpers/revalidator";
import { MenuItemFormData, menuItemSchema } from "@/schemas/menu";
import { createResponse } from "@/helpers/api-responses";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const formData = await request.formData();

    // Parse choices
    const choicesEntry = formData.get("choices");
    let choices: unknown[] = [];
    if (typeof choicesEntry === "string") {
      try {
        choices = JSON.parse(choicesEntry);
      } catch {
        choices = [];
      }
    }

    // Extract values safely
    const data = {
      name: formData.get("name"),
      description: formData.get("description"),
      price: Number(formData.get("price")),
      category: formData.get("category"),
      image: formData.get("image"),
      is_available: formData.get("is_available") === "true",
      is_popular: formData.get("is_popular") === "true",
      lqip: formData.get("lqip"),
      start_time: formData.get("start_time"),
      end_time: formData.get("end_time"),
      choices,
    };

    // Validate
    const parsedData = menuItemSchema.safeParse(data);
    if (!parsedData.success) {
      const errors = parsedData.error.flatten().fieldErrors;
      return createResponse(
        400,
        "Invalid form data",
        JSON.stringify(errors),
        false
      );
    }

    // Image upload
    let uploadedImageUrl: string | null = null;
    let publicId: string | null = null;
    const imageFile = data.image as File | null;
    const sanitizedRestaurantName = await getSanitizedPath();

    if (imageFile) {
      const uploadResult = await uploadImageToCloudinary(
        imageFile,
        `${sanitizedRestaurantName}/menu-items`
      );
      uploadedImageUrl = uploadResult.secure_url;
      publicId = uploadResult.public_id;
    }
    //Getting the authorised user;
    const {data: {user}, error: userError} = await supabase.auth.getUser();

    if(userError) {
      return createResponse(403, "Anauthorised request");
    }

    const branch_id = await getCurrentBranchId();

    if(!branch_id) {
      return createResponse(403, "You have to select a branch first before creating a menu item");
    }
    // Prepare new menu item
    const newMenuItem = {
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      is_available: data.is_available,
      lqip: data.lqip,
      is_popular: data.is_popular,
      choices: data.choices,
      start_time: data.start_time,
      end_time: data.end_time,
      dietary_preference: [],
      image_url: uploadedImageUrl,
      branch_id,
      public_id: publicId,
    };

    // Insert into Supabase and return the inserted row
    const { data: insertedItem, error } = await supabase
      .from("menu_items")
      .insert([newMenuItem])
      .select()
      .single();

    if (error || !insertedItem) {
      return createResponse(
        500,
        "Failed to save item",
        error?.message ?? "Unknown error",
        false
      );
    }

    // Return the newly inserted item including its Supabase ID
    return createResponse(
      200,
      "Menu item was created successfully",
      insertedItem,
      true
    );
  } catch (err) {
    const error = err as Error;
    return createResponse(
      500,
      error.message || "An error occurred while submitting your menu details",
      null,
      false
    );
  }
}

export async function GET(req: NextRequest) {
  // Checking if the user is authenticated
  const { supabase, response } = await getAuthenticatedUser();
  if (response) return response;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const branchId = await getCurrentBranchId();

  if(!branchId){
    return createResponse(403, "You should choose a branch before fetching menu items");
  }

  if (id) {
    // Fetch a single item by ID
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("id", id).eq("branch_id", branchId)
      .single();

    if (error) {
      return createResponse(500, "Failed to fetch menu item", null);
    }

    return createResponse(200, "Menu item fetched successfully", data);
  }

  //Otherwise fetch all menu items is not provided and id
  const { data, error } = await supabase
    .from("menu_items")
    .select("*").eq("branch_id", branchId)
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error)
    return createResponse(502, "Failed to fetch menu items from the database");
  }

  //  data is an array of MenuItem, so cast to MenuItem[]
  return createResponse(200, "Menu items fetched successfully", data);
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();

  try {
    const formData = await request.formData();
    const id = formData.get("id")?.toString();

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

    await revalidatePage("/menu");
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

export async function DELETE(request: NextRequest) {
  // Checking if the user is authenticated
const supabase = await createClient();

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

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
      .eq("id", id).select().single();

    if (deleteError) {
      return createResponse(502,
        "Failed to delete menu item",
      );
    }
    //revalidating the page in the frontend for the menu items to be rendered
    await revalidatePage("/menu");
    //  returning a success message to the frontend
    return createResponse(200, "Menu item deleted successfully", data);
  } catch (err) {
    const error = err as Error;
    return createResponse(500, "Server error");
  }
}

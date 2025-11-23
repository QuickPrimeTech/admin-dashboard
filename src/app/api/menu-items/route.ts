// app/api/menu-items/route.ts
import { NextRequest } from "next/server";
import {
  getSanitizedPath,
  getAuthenticatedUser,
  uploadImageToCloudinary,
  getCurrentBranchId,
} from "@/helpers/common";
import { menuItemSchema } from "@/schemas/menu";
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

    const branch_id = await getCurrentBranchId();

    if (!branch_id) {
      return createResponse(
        403,
        "You have to select a branch first before creating a menu item"
      );
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

  if (!branchId) {
    return createResponse(
      403,
      "You should choose a branch before fetching menu items"
    );
  }

  if (id) {
    // Fetch a single item by ID
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("id", id)
      .eq("branch_id", branchId)
      .single();

    if (error) {
      return createResponse(500, "Failed to fetch menu item", null);
    }

    return createResponse(200, "Menu item fetched successfully", data);
  }

  //Otherwise fetch all menu items is not provided and id
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("branch_id", branchId)
    .order("created_at", { ascending: false });

  if (error) {
    return createResponse(502, "Failed to fetch menu items from the database");
  }

  //  data is an array of MenuItem, so cast to MenuItem[]
  return createResponse(200, "Menu items fetched successfully", data);
}

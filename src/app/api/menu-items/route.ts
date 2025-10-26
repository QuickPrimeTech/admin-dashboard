// app/api/menu-items/route.ts
import { NextRequest, NextResponse } from "next/server";

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
import { revalidatePage } from "@/helpers/revalidator";
import { menuItemSchema } from "@/schemas/menu";

export async function POST(request: NextRequest) {
  // checking if the client is authenticated to add a menu item
  const { user, response, supabase } = await getAuthenticatedUser();
  if (response) return response;
  const formData = await request.formData();
  try {
    //Parsing the choices to an array
    const choicesEntry = formData.get("choices");
    let choices: unknown[] = [];
    if (typeof choicesEntry === "string") {
      try {
        choices = JSON.parse(choicesEntry);
      } catch {
        choices = [];
      }
    }

    // Safely extract values from FormData rather than asserting the entire FormData shape
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

    //Validating the form data using the MenuItemFormData schema
    const parsedData = menuItemSchema.safeParse(data);
    if (!parsedData.success) {
      const errors = parsedData.error.flatten().fieldErrors;
      console.log("Validation errors:", errors);
      return errorResponse("Invalid form data", 400, JSON.stringify(errors));
    }
    // declaring intial values in order to determine later if the image was sent to cloudinary
    let uploadedImageUrl = null;
    let publicId = null;

    //Getting the image file sent by the user
    const imageFile = data.image as File | null;

    // since the user exist we can fetch the restaurant name from supabase through the user.id
    const sanitizedRestaurantName = await getSanitizedRestaurantName(user.id);
    //Checking if the image exist so that I can send it to cloudinary
    if (imageFile) {
      // preparing the image to upload to cloudinary
      const uploadResult = await uploadImageToCloudinary(
        imageFile,
        `${sanitizedRestaurantName}/menu-items`
      );

      uploadedImageUrl = uploadResult.secure_url;
      publicId = uploadResult.public_id;
    }
    //Now preparing the newMenuItem
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
      public_id: publicId,
      user_id: user.id,
    };
    const { error } = await supabase.from("menu_items").insert([newMenuItem]);
    if (error) {
      return errorResponse("Failed to save item", 500, error.message);
    }
    return NextResponse.json({ message: "Menu item was created successfully" });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json(
      {
        message:
          error.message ||
          "An error occured while trying to submit your menu details",
      },
      { status: 403 }
    );
  }
}

export async function GET(req: NextRequest) {
  // Checking if the user is authenticated
  const { supabase, response } = await getAuthenticatedUser();
  if (response) return response;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    // Fetch a single item by ID
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return errorResponse("Failed to fetch menu item", 500, error.message);
    }

    return successResponse("Menu item fetched successfully", data);
  }

  //Otherwise fetch all menu items is not provided and id
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return errorResponse("Failed to fetch menu items", 500, error.message);
  }

  //  data is an array of MenuItem, so cast to MenuItem[]
  return successResponse("Menu items fetched successfully", data);
}

export async function PATCH(req: NextRequest) {
  const formData = await req.formData();
  console.log(formData);
  return NextResponse.json({ message: "The data was successfully received" });
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

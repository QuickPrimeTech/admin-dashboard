// app/api/menu-items/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { cleanFormData } from "@/lib/clean-form-data";
import { cloudinary } from "@/lib/server/cloudinary";

interface UploadResult {
  secure_url: string;
  public_id: string;
}

interface FormDataFields {
  id?: string;
  name: string;
  description: string;
  price: string;
  category: string;
  is_available: string | boolean;
  dietary_preference?: string[];
  image_url?: string;
}

export async function POST(request: NextRequest) {
  // checking if the client is authenticated to add a menu item
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

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
      return NextResponse.json(
        { success: false, message: "Your menu item requires an image" },
        { status: 403 }
      );
    }

    // since the user exist we can fetch the restaurant name from supabase through the user.id
    const { data: restaurant, error: restaurantError } = await supabase
      .from("restaurants")
      .select("name")
      .eq("user_id", user.id)
      .single();
    //checking if the restaurant name exists and if not we are going to return an error
    if (!restaurant || restaurantError) {
      return NextResponse.json(
        { success: false, message: "Restaurant not found" },
        { status: 404 }
      );
    }
    // Now that we have the restaurant name we will sanitise it into a cloudinary friendly name
    const sanitizedRestaurantName = restaurant.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");

    // preparing the image to upload to cloudinary
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise<UploadResult>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: `${sanitizedRestaurantName}/menu-items` },
          (error, result) => {
            if (error || !result) return reject(error);
            resolve(result as UploadResult);
          }
        )
        .end(buffer);
    });

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
      return NextResponse.json(
        {
          success: false,
          message: "Failed to save item",
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Menu item created successfully",
    });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch menu items",
        error: error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Menu items fetched successfully",
    data,
  });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  const { data: restaurant, error: restaurantError } = await supabase
    .from("restaurants")
    .select("name")
    .eq("user_id", user.id)
    .single();

  //checking if the restaurant name exists and if not we are going to return an error
  if (!restaurant || restaurantError) {
    return NextResponse.json(
      { success: false, message: "Restaurant not found" },
      { status: 404 }
    );
  }
  // Now that we have the restaurant name we will sanitise it into a cloudinary friendly name
  const sanitizedRestaurantName = restaurant.name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");

  try {
    const formData = await request.formData();
    const data = cleanFormData(formData) as unknown as FormDataFields;
    const id = data.id;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing menu item ID" },
        { status: 400 }
      );
    }

    const { data: currentItem, error: fetchError } = await supabase
      .from("menu_items")
      .select("public_id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !currentItem) {
      return NextResponse.json(
        {
          success: false,
          message: "Item not found",
          error: fetchError?.message,
        },
        { status: 404 }
      );
    }

    let uploadedImageUrl = data.image_url || "";
    let newPublicId = currentItem?.public_id || "";
    const imageFile = formData.get("image") as File | null;

    if (imageFile) {
      if (currentItem?.public_id) {
        await cloudinary.uploader.destroy(currentItem.public_id);
      }

      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // inserting the image to the cloudinary folder that matches the restaurant name
      //for organisation purposes
      const uploadResult = await new Promise<UploadResult>(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { folder: `${sanitizedRestaurantName}/menu-items` },
              (error, result) => {
                if (error || !result) return reject(error);
                resolve(result as UploadResult);
              }
            )
            .end(buffer);
        }
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
      ...(uploadedImageUrl && { image_url: uploadedImageUrl }),
    };

    const { data: updated, error: updateError } = await supabase
      .from("menu_items")
      .update(updatedMenuItem)
      .eq("id", parseInt(id))
      .eq("user_id", user.id);

    if (updateError) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update menu item",
          error: updateError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Menu item updated successfully",
      data: updated,
    });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing menu item ID" },
        { status: 400 }
      );
    }

    const { data: item, error: fetchError } = await supabase
      .from("menu_items")
      .select("public_id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !item) {
      return NextResponse.json(
        {
          success: false,
          message: "Menu item not found",
          error: fetchError?.message,
        },
        { status: 404 }
      );
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
      return NextResponse.json(
        {
          success: false,
          message: "Failed to delete menu item",
          error: deleteError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Menu item deleted successfully",
    });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

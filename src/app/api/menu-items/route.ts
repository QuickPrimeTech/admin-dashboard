// Import required types and utilities from Next.js and local libraries
import { NextRequest, NextResponse } from "next/server";
import { cleanFormData } from "@/lib/clean-form-data"; // Utility to clean and parse form data
import { cloudinary } from "@/lib/cloudinary"; // Cloudinary client for image upload
import { supabase } from "@/lib/supabase"; // Supabase client instance

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

// Handle POST requests for creating a new menu item
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const data = cleanFormData(formData) as unknown as FormDataFields;
    let uploadedImageUrl = "";
    let publicId = "";

    const imageFile = formData.get("image") as File | null;

    if (imageFile) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult = await new Promise<UploadResult>(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "menu-items" }, (error, result) => {
              if (error || !result) return reject(error);
              resolve(result as UploadResult);
            })
            .end(buffer);
        }
      );

      uploadedImageUrl = uploadResult.secure_url;
      publicId = uploadResult.public_id;
    }

    if (publicId) {
      const newMenuItem = {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        category: data.category,
        is_available:
          data.is_available === "true" || data.is_available === true,
        dietary_preference: data.dietary_preference || [],
        image_url: uploadedImageUrl,
        public_id: publicId,
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

// Handle GET requests to fetch all menu items from Supabase
export async function GET() {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
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

// Handle PATCH requests to update a menu item
export async function PATCH(request: NextRequest) {
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
      .single();

    if (fetchError) {
      return NextResponse.json(
        {
          success: false,
          message: "Item not found",
          error: fetchError.message,
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

      const uploadResult = await new Promise<UploadResult>(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "menu-items" }, (error, result) => {
              if (error || !result) return reject(error);
              resolve(result as UploadResult);
            })
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
      ...(uploadedImageUrl !== "" && { image_url: uploadedImageUrl }),
    };

    const { data: updated, error: updateError } = await supabase
      .from("menu_items")
      .update(updatedMenuItem)
      .eq("id", parseInt(id));

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

// Function to delete the images from Cloudinary and the entry in Supabase
export async function DELETE(request: NextRequest) {
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
      .eq("id", id);

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

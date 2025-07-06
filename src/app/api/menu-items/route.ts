// Import required types and utilities from Next.js and local libraries
import { NextRequest, NextResponse } from "next/server";
import { cleanFormData } from "@/lib/clean-form-data"; // Utility to clean and parse form data
import { cloudinary } from "@/lib/cloudinary"; // Cloudinary client for image upload
import { supabase } from "@/lib/supabase"; // Supabase client instance

// Handle POST requests for creating a new menu item
export async function POST(request: NextRequest) {
  try {
    // Step 1: Extract and clean form data
    const formData = await request.formData();
    const data = cleanFormData(formData);
    console.log("Cleaned Form Data:", data);

    // Step 2: Upload image to Cloudinary
    let uploadedImageUrl = "";
    const imageFile = formData.get("image") as File | null;

    if (imageFile) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "menu-items" }, (error, result) => {
            error ? reject(error) : resolve(result);
          })
          .end(buffer);
      });

      uploadedImageUrl = uploadResult.secure_url;
      console.log("Image uploaded:", uploadedImageUrl);
    }

    // Step 3: Construct the menu item for Supabase insert
    const newMenuItem = {
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      category: data.category,
      is_available: data.is_available === "true" || data.is_available === true,
      type: data.dietary_preference || [],
      image_url: uploadedImageUrl,
    };

    console.log("Data to insert:", newMenuItem);

    // Step 4: Insert into Supabase
    const { error } = await supabase.from("menu_items").insert([newMenuItem]);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to save item",
          error: error.message,
        },
        { status: 500 }
      );
    }

    // Step 5: Respond with success
    return NextResponse.json({
      success: true,
      message: "Menu item created successfully",
      data: newMenuItem,
    });
  } catch (err: any) {
    console.error("Unexpected Error:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}

// Handle GET requests to fetch all menu items from Supabase
export async function GET() {
  const { data, error } = await supabase.from("menu_items").select("*");

  if (error) {
    console.error("Error fetching menu items:", error);
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

// Import required types and utilities from Next.js and local libraries
import { NextRequest, NextResponse } from "next/server";
import { cleanFormData } from "@/lib/clean-form-data"; // Utility to clean and parse form data
import { cloudinary } from "@/lib/cloudinary"; // Cloudinary client for image upload
import { supabase } from "@/lib/supabase"; // Supabase client instance

// Handle POST requests for creating a new menu item
export async function POST(request: NextRequest) {
  try {
    // Step 1: Extract form data from the incoming request
    const formData = await request.formData();

    // Step 2: Clean the form data by removing empty fields and parsing values
    const data = cleanFormData(formData);
    console.log("Cleaned Form Data:", data);

    // Step 3: Handle image upload to Cloudinary
    let uploadedImageUrl = "";

    // Get the image file from the form data
    const imageFile = formData.get("image") as File | null;

    if (imageFile) {
      // Convert image file to a buffer for Cloudinary upload
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload the image to Cloudinary under the 'menu-items' folder
      const uploadResult = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "menu-items" }, (error, result) => {
            error ? reject(error) : resolve(result);
          })
          .end(buffer);
      });

      // Store the uploaded image's secure URL
      uploadedImageUrl = uploadResult.secure_url;
      console.log("Image uploaded:", uploadedImageUrl);
    }

    // Step 4: Prepare the final object to be inserted into Supabase
    const newMenuItem = {
      name: data.name, // Menu item name
      description: data.description, // Description of the item
      price: parseFloat(data.price), // Price, converted from string to float
      category: data.category, // Category (e.g., main, dessert)
      is_available: data.is_available === "true" || data.is_available === true, // Convert availability to boolean
      type: data.dietary_preference || [], // Dietary preferences, saved as `type`
      image_url: uploadedImageUrl, // Cloudinary image URL
    };

    console.log("Data to insert:", newMenuItem);

    // Step 5: Insert the cleaned data into the `menu_items` table in Supabase
    const { error } = await supabase.from("menu_items").insert([newMenuItem]);

    // Step 6: Handle insertion error
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

    // Step 7: Return a success response
    return NextResponse.json({
      success: true,
      message: "Menu item created successfully",
      data: newMenuItem,
    });
  } catch (err: any) {
    // Step 8: Handle unexpected server errors
    console.error("Unexpected Error:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}
// get function for selecting all menu items from the supabase
// Handle GET request to fetch all menu items
export async function GET() {
  // Fetch all items from the "menu_items" table
  const { data, error } = await supabase.from("menu_items").select("*");

  // If there's an error, return it in the response
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

  // Return the fetched data
  return NextResponse.json({
    success: true,
    message: "Menu items fetched successfully",
    data,
  });
}

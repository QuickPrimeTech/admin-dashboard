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
    let uploadedImageUrl,
      publicId = "";

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
      publicId = uploadResult.public_id;
    }
    if (publicId) {
      // Step 3: Construct the menu item for Supabase insert
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

      // console.log("Data to insert:", newMenuItem);

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
    }
    // Step 5: Respond with success
    return NextResponse.json({
      success: true,
      message: "Menu item created successfully",
      // data: newMenuItem,
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
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .order("created_at", { ascending: false }); // ⬅️ Sort by latest first

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
// Handle PATCH requests to update a menu item
export async function PATCH(request: NextRequest) {
  try {
    const formData = await request.formData();
    const data = cleanFormData(formData);
    const id = data.id;
    console.log("data ---->", data);

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing menu item ID" },
        { status: 400 }
      );
    }

    // Fetch the current item from Supabase to get the old public_id
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

    console.log("current item---->", currentItem);

    if (imageFile) {
      console.log("image available");
      // 🧹 Step 1: Delete the old image from Cloudinary
      if (currentItem?.public_id) {
        await cloudinary.uploader.destroy(currentItem.public_id);
      }

      // 💾 Step 2: Upload the new image
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
      newPublicId = uploadResult.public_id;
    }

    // Prepare payload for Supabase
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
  } catch (err: any) {
    console.error("Unexpected Error:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}

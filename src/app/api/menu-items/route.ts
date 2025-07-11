// app/api/menu-items/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
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

async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
      },
    }
  );
}

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
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
    const data = cleanFormData(formData) as unknown as FormDataFields;
    let uploadedImageUrl = "";
    let publicId = "";
    console.log(data);
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
  const supabase = await createSupabaseServerClient();
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
  const supabase = await createSupabaseServerClient();
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
  const supabase = await createSupabaseServerClient();
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

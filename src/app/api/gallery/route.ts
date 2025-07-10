// app/api/gallery/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { cloudinary } from "@/lib/server/cloudinary";
import { GalleryItemInsert } from "@/types/gallery";
import { UploadApiResponse } from "cloudinary";

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

export async function POST(req: NextRequest) {
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
    const formData = await req.formData();
    const title = formData.get("title") as string | null;
    const description = formData.get("description") as string | null;
    const is_published = formData.get("is_published") === "true";
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult: UploadApiResponse = await new Promise(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "gallery" }, (error, result) => {
            if (error || !result) reject(error || new Error("Upload failed"));
            else resolve(result);
          })
          .end(buffer);
      }
    );

    const galleryItem: GalleryItemInsert = {
      title: title || null,
      description: description || null,
      is_published,
      image_url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      user_id: user.id,
    };

    const { error: supabaseError } = await supabase
      .from("gallery")
      .insert(galleryItem);

    if (supabaseError) {
      return NextResponse.json(
        { success: false, message: "Failed to insert into Supabase" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      cloudinary: uploadResult,
      message: "Image uploaded to Cloudinary successfully",
    });
  } catch {
    return NextResponse.json({
      success: false,
      message: "An error occurred while uploading your gallery item",
    });
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

  try {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
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

  const formData = await req.formData();
  const id = formData.get("id") as string;
  const file = formData.get("file") as File | null;
  const title = formData.get("title");
  const description = formData.get("description");
  const is_published = formData.get("is_published");

  const { data, error } = await supabase
    .from("gallery")
    .select("public_id")
    .eq("id", Number(id))
    .eq("user_id", user.id)
    .single();

  if (error) {
    return NextResponse.json(
      { success: false, message: "Item not found or unauthorized" },
      { status: 404 }
    );
  }

  let uploadedImageUrl = "";
  let publicId = data.public_id;

  if (file) {
    await cloudinary.uploader.destroy(publicId, { invalidate: true });
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult: UploadApiResponse = await new Promise(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "gallery" }, (error, result) => {
            if (error || !result) reject(error || new Error("Upload failed"));
            else resolve(result);
          })
          .end(buffer);
      }
    );

    uploadedImageUrl = uploadResult.secure_url;
    publicId = uploadResult.public_id;
  }

  const galleryItem = {
    title: title || null,
    description: description || null,
    is_published,
    ...(uploadedImageUrl && { image_url: uploadedImageUrl }),
    ...(publicId && { public_id: publicId }),
  };

  const { error: updateError } = await supabase
    .from("gallery")
    .update(galleryItem)
    .eq("id", parseInt(id))
    .eq("user_id", user.id);

  if (updateError) {
    return NextResponse.json(
      { success: false, message: updateError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Successfully updated your gallery photo.",
  });
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

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { success: false, message: "Missing gallery item ID" },
      { status: 400 }
    );
  }

  const { data: item, error: fetchError } = await supabase
    .from("gallery")
    .select("public_id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !item) {
    return NextResponse.json(
      {
        success: false,
        message: "Gallery item not found",
        error: fetchError?.message,
      },
      { status: 404 }
    );
  }

  if (item.public_id) {
    await cloudinary.uploader.destroy(item.public_id);
  }

  const { error: deleteError } = await supabase
    .from("gallery")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (deleteError) {
    return NextResponse.json(
      { success: false, message: deleteError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Gallery photo deleted successfully",
  });
}

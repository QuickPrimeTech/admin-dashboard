import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { cloudinary } from "@/lib/cloudinary";
import { GalleryItemInsert } from "@/types/gallery";
import { UploadApiResponse } from "cloudinary";

//Upated the post
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const title = formData.get("title") as string | null;
    const description = formData.get("description") as string | null;
    const is_published = formData.get("is_published") === "true";

    const file = formData.get("file") as File | null;

    // checking if the file doesn't exist
    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }

    // converting the file to a buffer so that I can send it to cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    //Sending the data and then fetching the upload result

    const uploadResult: UploadApiResponse = await new Promise(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "gallery" }, (error, result) => {
            if (error) {
              reject(error);
            } else if (!result) {
              reject(new Error("Upload failed with no result from Cloudinary"));
            } else {
              resolve(result);
            }
          })
          .end(buffer);
      }
    );

    //Describing the data that goes into the supabase

    const galleryItem: GalleryItemInsert = {
      title: title || null,
      description: description || null,
      is_published,
      image_url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    };

    // Inserting the data

    const { error: supabaseError } = await supabase
      .from("gallery")
      .insert(galleryItem);

    //Checking if there is an error and then returning a response to the user

    if (supabaseError) {
      console.error(supabaseError);
      return NextResponse.json(
        { success: false, message: "Failed to insert into Supabase" },
        { status: 500 }
      );
    }

    //returning the response back to the front end
    return NextResponse.json({
      success: true,
      cloudinary: uploadResult,
      message: "Image uploaded to Cloudinary successfully",
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      success: false,
      message: "An error occured while uploading your gallery item",
    });
  }
}

// Get request for getting all the items to use in the grid
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false }); // optional: newest first

    if (error) {
      console.error("Supabase fetch error:", error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// Creating a patch request that takes all the data and updates it
export async function PATCH(req: NextRequest) {
  const formData = await req.formData();

  // Declaring all the data that will be used to update the table
  const id = formData.get("id") as string;
  const file = formData.get("file") as File | null;
  const title = formData.get("title");
  const description = formData.get("description");
  const is_published = formData.get("is_published");

  // getting the supabase public id so that the cloudinary api knows what to delete
  const { data, error } = await supabase
    .from("gallery")
    .select("public_id")
    .eq("id", Number(formData.get("id")))
    .single();

  if (error) {
    throw new Error("Failed to fetch data. Please check your internet");
  }

  const oldPublicId = data.public_id;

  // Declaring the public image so that I can later try to access it
  let uploadedImageUrl = "";
  let publicId = "";

  // // Deleting the existing image in cloudinary
  if (file) {
    await cloudinary.uploader.destroy(oldPublicId, {
      invalidate: true, // optional: clears cached versions
    });
    //   // converting the file to a buffer so that I can send it to cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Uploading the file to cloudinary
    const uploadResult: UploadApiResponse = await new Promise(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "gallery" }, (error, result) => {
            if (error) {
              reject(error);
            } else if (!result) {
              reject(new Error("Upload failed with no result from Cloudinary"));
            } else {
              resolve(result);
            }
          })
          .end(buffer);
      }
    );
    uploadedImageUrl = uploadResult.secure_url;
    publicId = uploadResult.public_id;
  }

  // creating the supabase schema

  const galleryItem = {
    title: title || null,
    description: description || null,
    is_published: is_published,
    ...(uploadedImageUrl !== "" && { image_url: uploadedImageUrl }),
    ...(publicId !== "" && { public_id: publicId }),
  };

  const { error: updateError } = await supabase
    .from("gallery")
    .update(galleryItem)
    .eq("id", parseInt(id));

  if (updateError) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update gallery photo. Please check your internet connection.",
        error: updateError.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      message: "Successfully updated your gallery photo.",
    },
    { status: 200 }
  );
}

// Creating a function to delete all the item from the id submittted
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
      .from("gallery")
      .select("public_id")
      .eq("id", id)
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
      message: "Gallery photo deleted successfully",
    });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

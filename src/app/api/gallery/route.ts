import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { cloudinary } from "@/lib/cloudinary";
import { GalleryItemInsert } from "@/types/gallery";
import { UploadApiResponse } from "cloudinary";

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

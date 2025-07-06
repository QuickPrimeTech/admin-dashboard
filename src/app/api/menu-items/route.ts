import { NextRequest, NextResponse } from "next/server";
import { cleanFormData } from "@/lib/clean-form-data";
import { cloudinary } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  // cleaning the data and preparing it for submission to supabase
  const data = cleanFormData(formData);
  console.log(data);

  //   creating the upload image url so that I can later send it back as a response
  let uploadedImageUrl = "";

  //   check if there is an image file
  const imageFile = formData.get("image") as File | null;

  if (imageFile) {
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Then uploading the image to cloudinary
    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "menu-items" }, (error, result) => {
          error ? reject(error) : resolve(result);
        })
        .end(buffer);
    });
    uploadedImageUrl = uploadResult.secure_url;
  }

  return NextResponse.json({
    success: true,
    message: "Data received and cleaned",
    imageUrl: uploadedImageUrl,
  });
}

//helpers/common.ts

import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { cloudinary } from "@/utils/cloudinary/server";
import { UploadResult } from "@/types/cloudinary";
import { cookies } from "next/headers";

//This function gets the current branch Id from the cookies setting
export async function getCurrentBranchId() {
  const currentBranch = (await cookies()).get('app_branch')?.value;
  return currentBranch;
}
//This is a function that fetches the restaurant name and sanitises it to match proper cloudinary folder names
export async function getAuthenticatedUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  const { user } = data;

  if (!user || error) {
    return {
      user: null,
      supabase,
      response: NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  return { user, supabase, response: null };
}

//This is the function that gets all the info about a menu items such as public Id so that actions such as deleting images is possible
export async function getMenuItemById(itemId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("id", itemId)
    .single();

  return { data, error };
}

//This is a function that fetches the restaurant name and sanitises it to match proper cloudinary folder names
export async function getSanitizedPath(): Promise<string> {
  const supabase = await createClient();

  //Get the restaurant name from the restaurant table
  const { data: restaurant, error } = await supabase
    .from("restaurants")
    .select("name")
    .single();

  if (!restaurant || error || !restaurant.name) {
    throw new Error("Restaurant not found for this user");
  }

  const currentBranchId =await getCurrentBranchId();

  if(!currentBranchId) {
    throw new Error("You need to select a branc before starting creating and updating menu items");
  }

  //Getting the branchName

  const {data: branchData, error: branchError} = await supabase.from("branch_settings").select('name').eq("id", currentBranchId).single()

  // catching error while fetching the current branch
  if (branchError || !branchData.name) {
    throw new Error("There was an error getting your current branch")
  }

  const currentBranchName = branchData.name;

   // Create sanitized path
  const sanitizedRestaurant = restaurant.name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");

  const sanitizedBranch = currentBranchName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");

    return `${sanitizedRestaurant}/${sanitizedBranch}`;
}

//This is the function that gets the folder path and uploads the image
export async function uploadImageToCloudinary(
  file: File,
  folderPath: string
): Promise<UploadResult> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise<UploadResult>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: folderPath }, (error, result) => {
        if (error || !result) return reject(error);
        resolve(result as UploadResult);
      })
      .end(buffer);
  });
}

export async function uploadAndReplaceImage(
  imageFile: File,
  folderPath: string,
  currentPublicId?: string
): Promise<UploadResult> {
  //deleting the original image so that the new one can come and replace it
  if (currentPublicId) {
    await deleteImageFromCloudinary(currentPublicId);
  }

  // buffering the image because cloudinary only allows buffers
  const arrayBuffer = await imageFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // returning the promise
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: folderPath }, (error, result) => {
        if (error || !result) return reject(error);
        resolve(result as UploadResult);
      })
      .end(buffer);
  });
}

//This is a cloudinary function that deletes an image when passed the id
export async function deleteImageFromCloudinary(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);

    // Cloudinary returns a structured object like:
    // { result: "ok" } or { result: "not found" } or { result: "error" }
    if (result.result !== "ok") {
      throw new Error(
        `Cloudinary deletion failed: ${result.result || "Unknown error"}`
      );
    }

    return result;
  } catch (error) {
    throw new Error(`Failed to delete image from Cloudinary ${error}`);
  }
}

// This are the function for returning either true of error responses
export function errorResponse(message: string, status = 500, error?: string) {
  return NextResponse.json({ success: false, message, error }, { status });
}

export function successResponse(message: string, data?: string[]) {
  return NextResponse.json({ success: true, message, ...(data && { data }) });
}

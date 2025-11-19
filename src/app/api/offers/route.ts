import { createResponse } from "@/helpers/api-responses";
import {
  deleteImageFromCloudinary,
  getCurrentBranchId,
  getSanitizedPath,
  uploadImageToCloudinary,
} from "@/helpers/common";
import { createClient } from "@/utils/supabase/server";

type OfferFormData = {
  title: string | null;
  description: string | null;
  start_time: string | null;
  end_time: string | null;
  is_recurring: boolean;
  start_date: string | null;
  end_date: string | null;
  days_of_week: number[];
  image_url: File | string | null;
  public_id?: string;
  branch_id: string;
};

export async function GET() {
  const supabase = await createClient();
  //Get the current branch id
  const branchId = await getCurrentBranchId();

  //If no branch id, return error
  if (!branchId) {
    return createResponse(
      502,
      "You need to select a branch before viewing any offers"
    );
  }

  //Fetch offers for the branch
  const { data: offers, error } = await supabase
    .from("offers")
    .select("*")
    .eq("branch_id", branchId);

  if (error) {
    return createResponse(502, "Failed to fetch offers. Please try again.");
  }

  return createResponse(200, "Offers endpoint is working", offers);
}
export async function POST(request: Request) {
  const formValues = await request.formData();
  const supabase = await createClient();

  try {
    const branchId = await getCurrentBranchId();

    if (!branchId) {
      return createResponse(
        502,
        "You need to select a branch before starting creating an offer"
      );
    }

    //Create the data object
    let data: OfferFormData = {
      title: formValues.get("title") as string,
      description: formValues.get("description") as string,
      start_time: formValues.get("startTime") as string,
      end_time: formValues.get("endTime") as string,
      is_recurring: formValues.get("isRecurring") === "true",
      start_date: (formValues.get("startDate") as string) || null,
      end_date: (formValues.get("endDate") as string) || null,
      days_of_week: formValues.get("daysOfWeek")
        ? JSON.parse(formValues.get("daysOfWeek") as string)
        : [],
      image_url: formValues.get("image") as File,
      branch_id: branchId,
    };

    if (
      data.image_url instanceof File &&
      data.image_url.size > 9 * 1024 * 1024
    ) {
      return createResponse(403, "Image size should not exceed 9MB.");
    }

    //Get the folder path for the offer images
    const folderPath = await getSanitizedPath();
    //Handle Image upload to cloudinary
    const uploadResult = await uploadImageToCloudinary(
      data.image_url as File,
      `${folderPath}/offers`
    );

    if (!uploadResult?.secure_url || !uploadResult?.public_id) {
      return createResponse(
        502,
        "Failed to upload offer image successfully. Please try again later or contact us"
      );
    }

    //Attach the image url and public id to the data object
    data.image_url = uploadResult.secure_url;
    data.public_id = uploadResult.public_id;

    //Insert the offer to the database
    const { data: insertData, error } = await supabase
      .from("offers")
      .insert(data)
      .select()
      .single();

    if (error) {
      //Rolling back the uploaded image in case of database insertion error
      await deleteImageFromCloudinary(uploadResult.public_id);
      return createResponse(502, "Failed to create offer. Please try again.");
    }

    return createResponse(200, "Offer created successfully", insertData);
  } catch (error) {
    console.error("Error creating offer:", error);
    return createResponse(500, "Internal Server Error");
  }
}

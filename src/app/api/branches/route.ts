import { createResponse } from "@/helpers/api-responses";
import { Branch } from "@/types/onboarding";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const request = await req.json();
  const supabase = await createClient();
  //   Fetching the restaurant id
  const { data: restaurantData, error } = await supabase
    .from("restaurants")
    .select("id")
    .single();
  if (error) {
    return createResponse<null>(
      500,
      "Error while fetching restaurant info",
      null,
      false
    );
  }
  console.log(restaurantData);

  //Inserting the branch into the branch_settings table
  const { data: branchData, error: branchError } = await supabase
    .from("branch_settings")
    .insert({
      name: request.name,
      restaurant_id: restaurantData.id,
    });
  if (branchError) {
    console.log(branchError);
    return createResponse<null>(
      500,
      "Error while creating restaurant branch",
      null,
      false
    );
  }

  return createResponse<Branch>(
    200,
    "Request received successfully",
    branchData,
    true
  );
}

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("branch_settings").select("*");
  if (error) {
    return createResponse<null>(
      500,
      "Error connecting with the database",
      null,
      false
    );
  }
  return createResponse<Branch[]>(
    200,
    "Successfully fetched all the branches",
    data,
    true
  );
}

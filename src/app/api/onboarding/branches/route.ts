import { createResponse } from "@/helpers/api-responses";
import { BranchFormValues } from "@/schemas/onboarding";
import { Branch } from "@/types/onboarding";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const branch = (await req.json()) as BranchFormValues;
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

  //Inserting the branch into the branch_settings table
  const { data: branchData, error: branchError } = await supabase
    .from("branch_settings")
    .insert({
      name: branch.name,
      location: branch.location,
      restaurant_id: restaurantData.id,
    })
    .select()
    .single();

  if (branchError) {
    return createResponse<null>(
      500,
      "Error while creating restaurant branch",
      null,
      false
    );
  }

  return createResponse<Branch>(
    200,
    `Successfully created branch "${branch.name}".`,
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

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const branch = await req.json();

  const { data, error } = await supabase
    .from("branch_settings")
    .update({ name: branch.name })
    .eq("id", branch.id)
    .select(); // <-- ensures data is returned if RLS allows

  if (error) {
    return createResponse<null>(500, "There was an error updating your branch");
  }

  if (!data || data.length === 0) {
    return createResponse<null>(
      403,
      "You are not authorized to update this branch or it does not exist",
      null,
      false
    );
  }

  return createResponse<Branch>(
    200,
    `Successfully updated your branch to ${branch.name}`,
    data[0],
    true
  );
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return createResponse<null>(401, "The branch id is required", null, false);
  }

  const { error: deleteError } = await supabase
    .from("branch_settings")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (deleteError) {
    return createResponse<null>(
      500,
      "Error deleting branch from the database",
      null,
      false
    );
  }

  return createResponse<Branch>(
    200,
    "Successfully deleted",
    { id, name: "sample branch" },
    true
  );
}

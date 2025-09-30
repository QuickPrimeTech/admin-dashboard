import {
  getAuthenticatedUser,
  errorResponse,
  successResponse,
} from "@/helpers/common";
export async function GET() {
  // Checking if the user is authenticated
  const { user, supabase, response } = await getAuthenticatedUser();
  if (response) return response;

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return errorResponse("Failed to fetch orders", 500, error.message);
  }

  //  data is an array of Order, so cast to Order[]
  return successResponse("Orders fetched successfully", data);
}

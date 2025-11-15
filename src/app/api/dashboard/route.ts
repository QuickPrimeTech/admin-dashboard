// /app/api/stats/route.ts
import { createClient } from "@/utils/supabase/server";
import { createResponse } from "@/helpers/api-responses";
import { OverviewStats } from "@/types/dashboard";
import { getCurrentBranchId } from "@/helpers/common";

export async function GET() {
  const supabase = await createClient();

  try {
    const branchId = await getCurrentBranchId();

    const [menuRes, reservationsRes, eventsRes, galleryRes] = await Promise.all(
      [
        supabase
          .from("menu_items")
          .select("*", { count: "exact", head: true }).eq("branch_id", branchId),

        supabase
          .from("reservations")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending").eq("branch_id", branchId),

        supabase
          .from("private_events")
          .select("*", { count: "exact", head: true }).eq("branch_id", branchId),

        supabase
          .from("gallery")
          .select("*", { count: "exact", head: true }).eq("branch_id", branchId)
      ]
    );
const data =  {
        menu: menuRes.count ?? 0,
        reservations: reservationsRes.count ?? 0,
        events: eventsRes.count ?? 0,
        gallery: galleryRes.count ?? 0,
      }

    return createResponse<OverviewStats>(200, "Successfully fetched all the overview stats", data);
  } catch {
    return createResponse(500, "There was an error fetching the overview statistics"
    );
  }
}

// components/restaurant/RestaurantName.tsx
import { createClient } from "@/utils/supabase/server";

export async function RestaurantName() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("name")
    .eq("user_id", user.id)
    .single();

  return (
    <span className="truncate font-semibold">
      {restaurant?.name ?? "Unnamed Restaurant"}
    </span>
  );
}

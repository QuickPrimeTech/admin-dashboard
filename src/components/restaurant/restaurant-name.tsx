"use client";

export function RestaurantName() {
  const restaurant = { name: "Sample Restaurant" };

  return (
    <span className="truncate font-semibold">
      {restaurant?.name ?? "Unnamed Restaurant"}
    </span>
  );
}

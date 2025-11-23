/* ------------------------------------------------------------------ */
/* Zod schema – mirrors the table constraints                         */

import z from "zod";

export const restaurantFormSchema = z.object({
  name: z.string().min(1, "Restaurant name is required"),
  owner: z.string().max(50, "Max 50 characters").optional().or(z.literal("")),
});

export type RestaurantFormData = z.infer<typeof restaurantFormSchema>;

/* ------------------------------------------------------------------ */
/* Zod schema – mirrors the table constraints                         */

import z from "zod";

export const restaurantFormSchema = z.object({
  name: z.string().min(1, "Restaurant name is required"),
  owner: z.string().max(50, "Max 50 characters").optional().or(z.literal("")),
  website: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true; // optional
        try {
          const url = new URL(val);
          return url.protocol === "https:"; // require HTTPS
        } catch {
          return false; // invalid URL
        }
      },
      { message: "Must be a valid URL with HTTPS (optional but recommended)" }
    ),
});

export type RestaurantFormData = z.infer<typeof restaurantFormSchema>;

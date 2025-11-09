import z from "zod";

//  Define Zod Schema
export const branchSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Branch name must be at least 2 characters." }),
});

export type BranchFormValues = z.infer<typeof branchSchema>;

export const restaurantSchema = z.object({
  name: z.string().min(2, "Restaurant name must be at least 2 characters"),
});

export type RestaurantFormValues = z.infer<typeof restaurantSchema>;

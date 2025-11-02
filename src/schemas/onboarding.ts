import z from "zod";

//  Define Zod Schema
export const branchSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Branch name must be at least 2 characters." }),
  location: z
    .string()
    .min(3, { message: "Location must be at least 3 characters." }),
});

export type BranchFormValues = z.infer<typeof branchSchema>;

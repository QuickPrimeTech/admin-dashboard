import * as z from "zod";

export const menuItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .min(0, "Price must be positive"),
  category: z.string().min(1, "Category is required"),
  dietary_preference: z.array(z.string()).optional(),
  is_available: z.boolean(),
  image_url: z.string().optional(),
});

// If you also want a TypeScript type:
export type MenuItemFormData = z.infer<typeof menuItemSchema>;

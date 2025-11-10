import { z } from "zod";

export const formSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  is_published: z.boolean(),
  image_url: z.string().min(1, "Image is required"),
  category: z.string().min(1, "Please select a category"),
});

export type FormData = z.infer<typeof formSchema>;

import * as z from "zod";

export const formSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  image_url: z.string().optional(),
  is_published: z.boolean(),
});

export type FormData = z.infer<typeof formSchema>;

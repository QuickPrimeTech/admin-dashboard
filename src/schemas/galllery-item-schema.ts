import { z } from "zod";

export const formSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  is_published: z.boolean(),
  file: z.instanceof(File, { message: "Image file is required" }),
});

export type FormData = z.infer<typeof formSchema>;

import z from "zod";

export const faqFormSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  is_published: z.boolean(),
});

export type FaqFormData = z.infer<typeof faqFormSchema>;

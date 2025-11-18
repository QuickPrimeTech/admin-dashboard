import z from "zod";

export const offerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  discount: z.string().optional(),
  cta: z.string().optional(),
  status: z.enum(["active", "upcoming", "expired", "recurring", "scheduled"]),
  customName: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  daysOfWeek: z.array(z.number()).optional(),
});

export type OfferFormValues = z.infer<typeof offerSchema>;

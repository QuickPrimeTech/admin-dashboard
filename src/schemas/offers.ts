import z from "zod";

// --- CORE SCHEMA ---
export const offerSchema = z.object({
  // Offer Details
  title: z.string().min(1, "The Offer Title is required."),
  description: z.string().min(1, "The Offer Description is required."),

  // Timing Details (Required for all offers)
  startTime: z
    .string()
    .regex(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "Must be a valid time (HH:MM)."
    ), // e.g., "16:00"
  endTime: z
    .string()
    .regex(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "Must be a valid time (HH:MM)."
    ), // e.g., "19:00"

  // Schedule Type
  isRecurring: z.boolean(),

  // Date Range (Only used if NOT recurring)
  startDate: z.string().optional(), // Date input returns string "YYYY-MM-DD"
  endDate: z.string().optional(), // Date input returns string "YYYY-MM-DD"

  // Recurring Days (Only used if IS recurring)
  daysOfWeek: z.array(z.number()).optional(), // Array of day indices (0=Sun, 1=Mon...)
});

// --- REFINEMENT LOGIC ---
export const refinedOfferSchema = offerSchema.superRefine((data, ctx) => {
  // 1. If the offer IS recurring, check if daysOfWeek are selected
  if (data.isRecurring) {
    if (!data.daysOfWeek || data.daysOfWeek.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select at least one day for a weekly repeating offer.",
        path: ["daysOfWeek"],
      });
    }
  }

  // 2. If the offer is NOT recurring, check if a start date is provided
  if (!data.isRecurring) {
    if (!data.startDate || data.startDate === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Start Date is required for a one-time offer.",
        path: ["startDate"],
      });
    }
  }

  // 3. Simple Check: Ensure end time is after start time
  if (data.startTime && data.endTime && data.startTime >= data.endTime) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "End Time must be after Start Time.",
      path: ["endTime"],
    });
  }
});

export type OfferFormValues = z.infer<typeof refinedOfferSchema>;

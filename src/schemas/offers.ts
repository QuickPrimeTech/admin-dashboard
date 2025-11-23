import z from "zod";

// --- CORE SCHEMA ---
export const offerSchema = z.object({
  // Offer Details (unchanged)
  title: z.string().min(1, "The Offer Title is required."),
  description: z.string().min(1, "The Offer Description is required."),

  // Timing Details (unchanged)
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

  // Schedule Type (unchanged)
  isRecurring: z.boolean(),

  // CORRECTED: Now expects Date objects or undefined
  startDate: z.date().optional(),
  endDate: z.date().optional(),

  // Recurring Days (unchanged)
  daysOfWeek: z.array(z.number()).optional(),

  // Current Zod Schema:
  image: z
    .instanceof(File)
    .nullable() // Allows null
    .optional(), // Allows undefined (for default values)
});

// --- REFINEMENT LOGIC ---
export const refinedOfferSchema = offerSchema.superRefine((data, ctx) => {
  // 1. Check if the image is present and is a File object (MAKING IT MANDATORY)
  if (!(data.image instanceof File)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Offer image is required.", // This is the required message
      path: ["image"],
    });
  }

  if (data.image instanceof File && data.image.size > 9 * 1024 * 1024) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Image size should not exceed 9MB.",
    });
  }

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
    //  CORRECTED: Check for undefined/null/invalid Date presence
    if (!data.startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Start Date is required for a one-time offer.",
        path: ["startDate"],
      });
    }

    // 2b. Check if endDate is before startDate (using Date object comparison)
    if (data.startDate && data.endDate && data.endDate < data.startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End Date cannot be before the Start Date.",
        path: ["endDate"],
      });
    }
  }

  // 3. Simple Check: Ensure end time is after start time (unchanged)
  if (data.startTime && data.endTime && data.startTime >= data.endTime) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "End Time must be after Start Time.",
      path: ["endTime"],
    });
  }
});

export type OfferFormValues = z.infer<typeof refinedOfferSchema>;

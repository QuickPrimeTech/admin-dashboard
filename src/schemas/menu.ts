import { z } from "zod";

// Choice option schema
export const choiceOptionSchema = z.object({
  label: z.string().min(1, "Option label is required"),
  price: z.number().optional(),
});

// ✅ Validation schema (optional image but must be valid type)e
export const imageSchema = z.object({
  image: z
    .any()
    .refine(
      (file) =>
        !file || (file instanceof File && file.type.startsWith("image/")),
      "Only image files are allowed"
    )
    .optional(),
});

// ✅ Define schema only for availability
export const availabilitySchema = z
  .object({
    is_available: z.boolean().default(true),
    is_popular: z.boolean().default(false),
    start_time: z
      .string()
      // Accepts both 08:00 and 08:00:00 formats
      .regex(
        /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/,
        "Invalid start time format"
      )
      .default("08:00"),
    end_time: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, "Invalid end time format")
      .default("22:00"),
  })
  // ✅ Normalize times to 24-hour "HH:MM" format for DB / backend
  .transform((data) => ({
    ...data,
    start_time: data.start_time.slice(0, 5),
    end_time: data.end_time.slice(0, 5),
  }));
export type AvailabilityFormData = z.infer<typeof availabilitySchema>;
// Choice schema
export const choiceSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Choice title is required"),
  required: z.boolean(),
  maxSelectable: z.number().int().positive().optional(),
  options: z
    .array(choiceOptionSchema)
    .min(1, "At least one option is required"),
});

// Main menu item schema
export const menuItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  image: z.instanceof(File).optional().or(z.null()), // allows clearing
  is_available: z.boolean(),
  is_popular: z.boolean(),
  lqip: z.string().optional().or(z.null()),
  slug: z.string().optional().or(z.null()),
  start_time: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "The start time is required"),
  end_time: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "The end time is required"),
  choices: z.array(choiceSchema).optional(),
});
// ✅ Validation schema only for this section
export const basicInfoSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .positive("Price must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
});

export type MenuItemFormData = z.infer<typeof menuItemSchema>;
export type BasicInfoFormData = z.infer<typeof basicInfoSchema>;
export type ImageFormValues = z.infer<typeof imageSchema>;
// Type exports
export type ChoiceOptionFormData = z.infer<typeof choiceOptionSchema>;
export type ChoiceFormData = z.infer<typeof choiceSchema>;

import { z } from "zod";

export const choiceOptionSchema = z.object({
  label: z.string().min(1, "Option name is required"),
  price: z.number().min(0).optional(),
});

export const choiceSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Choice title is required"),
  required: z.boolean().default(false),
  maxSelectable: z.number().min(1).optional(),
  options: z
    .array(choiceOptionSchema)
    .min(1, "At least one option is required"),
});

export const menuItemSchema = z.object({
  name: z
    .string()
    .min(1, "Item name is required")
    .min(3, "Name must be at least 3 characters"),
  price: z.coerce.number().min(0, "Price must be positive"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  image_url: z.string().optional(),

  /** ✅ new field: availability toggle */
  is_available: z.boolean().default(true),

  /** ✅ new fields: time range when dish is offered */
  start_time: z
    .string()
    .regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, "Invalid start time (HH:MM)"),
  end_time: z
    .string()
    .regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, "Invalid end time (HH:MM)"),

  /** optional customization options */
  choices: z.array(choiceSchema).optional().default([]),
});

export type MenuItemFormData = z.infer<typeof menuItemSchema>;
export type ChoiceFormData = z.infer<typeof choiceSchema>;
export type ChoiceOptionFormData = z.infer<typeof choiceOptionSchema>;

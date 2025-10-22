import { z } from "zod";

// Choice option schema
export const choiceOptionSchema = z.object({
  label: z.string().min(1, "Option label is required"),
  price: z.number().optional(),
});

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
  image_file: z.instanceof(File).optional().or(z.null()), // allows clearing
  is_available: z.boolean(),
  start_time: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  end_time: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  choices: z.array(choiceSchema).optional(),
});

// Type exports
export type ChoiceOptionFormData = z.infer<typeof choiceOptionSchema>;
export type ChoiceFormData = z.infer<typeof choiceSchema>;
export type MenuItemFormData = z.infer<typeof menuItemSchema>;

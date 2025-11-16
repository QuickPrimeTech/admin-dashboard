// @/schemas/branch-settings.ts

import { z } from "zod";

const url = z.string().url("Invalid URL").optional().or(z.literal(""));

export const branchSettingsSchema = z.object({
  id: z.string().uuid().optional(),
  restaurant_id: z.string().uuid().optional(),
  name: z.string().min(1, "Branch name is required"),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid e-mail").optional().or(z.literal("")),
  city: z.string().optional(),
  description: z.string().optional(),
  instagram_url: url,
  facebook_url: url,
  twitter_url: url,
  youtube_url: url,
  tiktok_url: url,
  opening_hours: z.string().optional(),
  is_open: z.boolean().optional().default(true),
  location: z.string().optional(),
});

export const basicInfoSchema = z.object({
  name: z.string().min(1, "Branch name is required"),
  opening_hours: z.string().optional(),
  is_open: z.boolean(),
});

export type BasicInfoData = z.infer<typeof basicInfoSchema>;

export type BranchSettings = z.infer<typeof branchSettingsSchema>;

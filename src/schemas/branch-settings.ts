// @/schemas/branch-settings.ts
import { z } from "zod";

const url = z.string().url("Invalid URL").optional().or(z.literal(""));

export const dayScheduleSchema = z.object({
  day: z.string(),
  isOpen: z.boolean(),
  openTime: z.string(),
  closeTime: z.string(),
});

export const basicInfoSchema = z.object({
  name: z.string().min(1, "Branch name is required"),
  opening_hours: z.array(dayScheduleSchema),
  is_open: z.boolean(),
});

export const contactInfoSchema = z.object({
  email: z.string().email("Invalid e-mail").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const socialMediaSchema = z.object({
  instagram_url: url,
  facebook_url: url,
  x_url: url,
  youtube_url: url,
  tiktok_url: url,
});

// Combined type for the API
export const branchSettingsSchema = z.object({
  // Basic info
  name: z.string().min(1).optional(),
  opening_hours: z.array(dayScheduleSchema).optional(),
  is_open: z.boolean().optional(),
  // Contact info
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  // Social media
  instagram_url: url.optional(),
  facebook_url: url.optional(),
  x_url: url.optional(),
  youtube_url: url.optional(),
  tiktok_url: url.optional(),
});

export type DaySchedule = z.infer<typeof dayScheduleSchema>;
export type BasicInfoData = z.infer<typeof basicInfoSchema>;
export type ContactInfoData = z.infer<typeof contactInfoSchema>;
export type SocialMediaData = z.infer<typeof socialMediaSchema>;
export type BranchSettingsData = z.infer<typeof branchSettingsSchema>;

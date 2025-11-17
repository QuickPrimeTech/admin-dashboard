// @/schemas/branch-settings.ts
import { z } from "zod";

const url = z.string().url("Invalid URL").optional().or(z.literal(""));

export const basicInfoSchema = z.object({
  name: z.string().min(1, "Branch name is required"),
  opening_hours: z.string().optional(),
  is_open: z.boolean(),
});

export type BasicInfoData = z.infer<typeof basicInfoSchema>;

export const contactInfoSchema = z.object({
  email: z.string().email("Invalid e-mail").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export type ContactInfoData = z.infer<typeof contactInfoSchema>;

export const socialMediaSchema = z.object({
  instagram_url: url,
  facebook_url: url,
  x: url,
  youtube_url: url,
  tiktok_url: url,
});

export type SocialMediaData = z.infer<typeof socialMediaSchema>;

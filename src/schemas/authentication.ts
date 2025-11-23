import { getPasswordStrength } from "@/helpers/authentication";
import z from "zod";

/* -------------------- Base Password Schema -------------------- */
const basePasswordSchema = z.string().min(1, "Password is required"); // loose by default

/* -------------------- Base Auth Schema -------------------- */
export const baseAuthSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: basePasswordSchema,
});

/* -------------------- Signup Schema -------------------- */
// Original signup base object without refine
const signupBaseObject = baseAuthSchema.extend({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .refine((val) => getPasswordStrength(val).score >= 3, {
      message: "Password must be at least Moderate strength",
    }),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms",
  }),
});

// Signup schema with refine for password confirmation
export const signupSchema = signupBaseObject.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }
);

export type SignupFormData = z.infer<typeof signupSchema>;

/* -------------------- Login Schema -------------------- */
export const loginSchema = baseAuthSchema.extend({
  rememberMe: z.boolean().default(false),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/* -------------------- Forgot Password Schema -------------------- */
export const forgotPasswordSchema = baseAuthSchema.pick({ email: true });

export type ForgotPassworFormData = z.infer<typeof forgotPasswordSchema>;

/* -------------------- Forgot Password Schema -------------------- */
export const resetPasswordSchema = signupBaseObject.pick({ password: true });

export type ResetPassworFormData = z.infer<typeof resetPasswordSchema>;

/* ------------------------------------------------------------------ */
/* Account-settings schema                                            */
/* ------------------------------------------------------------------ */

export const accountSettingsSchema = signupBaseObject
  .omit({ terms: true })
  .extend({
    currentPassword: z
      .string()
      .min(1, "Current password required to save changes"),
    password: z
      .string()
      .optional()
      .refine((v) => !v || v.length >= 8, {
        message: "New password must be ≥ 8 characters",
      })
      .refine((v) => !v || getPasswordStrength(v).score >= 3, {
        message: "New password must be at least Moderate strength",
      }),
    confirmPassword: z.string().optional(),
  })
  .refine((d) => !d.password || d.password === d.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  });

export type AccountSettingsData = z.infer<typeof accountSettingsSchema>;

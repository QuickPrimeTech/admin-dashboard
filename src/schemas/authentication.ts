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
export const signupSchema = baseAuthSchema
  .extend({
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
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;

/* -------------------- Login Schema -------------------- */
export const loginSchema = baseAuthSchema.extend({
  rememberMe: z.boolean().default(false),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/* -------------------- Forgot Password Schema -------------------- */
export const forgotPasswordSchema = baseAuthSchema.pick({ email: true });

export type forgotPassworFormData = z.infer<typeof forgotPasswordSchema>;

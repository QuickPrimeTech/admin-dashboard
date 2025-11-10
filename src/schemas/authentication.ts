import { getPasswordStrength } from "@/helpers/authentication";
import z from "zod";

export const formSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .refine(
        (val) => {
          const { score } = getPasswordStrength(val);
          return score >= 3; // only allow Moderate (3) or higher
        },
        { message: "Password must be at least Moderate strength" }
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type InviteFormData = z.infer<typeof formSchema>;

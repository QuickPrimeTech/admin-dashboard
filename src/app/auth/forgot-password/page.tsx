import { ForgotPasswordForm } from "@/sections/auth/forgot-password";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password - QuickPrimeTech",
  description:
    "Reset your QuickPrimeTech account password securely by entering your email address.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}

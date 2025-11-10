import { LoginForm } from "@/sections/login/login-form";
import { FeaturesPanel } from "@/sections/login/features-panel";
import { Metadata } from "next";

// Static metadata
export const metadata: Metadata = {
  title: "Login - QuickPrimeTech",
  description: "Log in to access your QuickPrimeTech dashboard.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      <FeaturesPanel />
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

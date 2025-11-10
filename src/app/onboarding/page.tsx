import { OnboardingBackgroundPattern } from "@/components/background-patterns/onboarding-pattern";
import { ClientOnboarding } from "@/sections/onboarding/client-onboarding";
import { Metadata } from "next";

// Static metadata
export const metadata: Metadata = {
  title: "Client Onboarding - QuickPrimeTech",
  description: "Complete your onboarding to get started with QuickPrimeTech.",
};

export default function Onboarding() {
  return (
    <div className="min-h-screen relative overflow-hidden pb-9">
      <OnboardingBackgroundPattern />
      <ClientOnboarding />
    </div>
  );
}

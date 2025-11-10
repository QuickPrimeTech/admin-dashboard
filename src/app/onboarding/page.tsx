import { OnboardingBackgroundPattern } from "@/components/background-patterns/onboarding-pattern";
import { ClientOnboarding } from "@/sections/onboarding/client-onboarding";

export default function Onboarding() {
  return (
    <div className="min-h-screen relative overflow-hidden pb-9">
      <OnboardingBackgroundPattern />
      <ClientOnboarding />
    </div>
  );
}

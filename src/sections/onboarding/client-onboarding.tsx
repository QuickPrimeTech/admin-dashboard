"use client";
import { useEffect, useState } from "react";
import { RestaurantInfoStep } from "@/sections/onboarding/restaurant-info-step";
import { BranchesStep } from "@/sections/onboarding/branches-step";
import { CompletionStep } from "@/sections/onboarding/completion-step";
import { OnboardingBackgroundPattern } from "@/components/background-patterns/onboarding-pattern";
import { ProgressBar } from "@/sections/onboarding/progress-bar";
import { OnboardingFooter } from "@/sections/onboarding/footer";
import { OnboardingStep, RestaurantInfo } from "@/types/onboarding";

export const STORAGE_KEY = "onboarding-progress";

export function ClientOnboarding() {
  const [currentStep, setCurrentStep] =
    useState<OnboardingStep>("restaurant-info");
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo | null>(
    null
  );
  // const [branches, setBranches] = useState<Branch[]>([]);

  // Restore progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setCurrentStep(parsed.currentStep || "restaurant-info");
      setRestaurantInfo(parsed.restaurantInfo || null);
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ currentStep, restaurantInfo })
    );
  }, [currentStep, restaurantInfo]);

  const steps = [
    { key: "restaurant-info", label: "Restaurant Info" },
    { key: "branches", label: "Branches" },
    { key: "complete", label: "Complete" },
  ];

  const handleStepComplete = (
    data: RestaurantInfo | null,
    nextStep: OnboardingStep
  ) => {
    if (currentStep === "restaurant-info") {
      setRestaurantInfo(data as RestaurantInfo);
    }
    setCurrentStep(nextStep);
  };

  return (
    <>
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Progress Indicator */}
        <div className="max-w-2xl mx-auto mb-12">
          <ProgressBar steps={steps} currentStep={currentStep} />
        </div>

        {/* Step Content */}
        {currentStep === "restaurant-info" && (
          <RestaurantInfoStep
            onComplete={handleStepComplete}
            initialData={restaurantInfo || undefined}
          />
        )}

        {currentStep === "branches" && restaurantInfo && (
          <BranchesStep
            onComplete={handleStepComplete}
            onBack={() => setCurrentStep("restaurant-info")}
            restaurantName={restaurantInfo.name}
          />
        )}

        {currentStep === "complete" && restaurantInfo && (
          <CompletionStep restaurantName={restaurantInfo.name} />
        )}
      </div>
      <OnboardingFooter />
    </>
  );
}

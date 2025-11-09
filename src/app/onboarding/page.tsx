"use client";

import { useState } from "react";
import { RestaurantInfoStep } from "@/sections/onboarding/restaurant-info-step";
import { BranchesStep } from "@/sections/onboarding/branches-step";
import { CompletionStep } from "@/sections/onboarding/completion-step";
import { OnboardingBackgroundPattern } from "@/components/background-patterns/onboarding-pattern";
import { ProgressBar } from "@/sections/onboarding/progress-bar";
import { OnboardingFooter } from "@/sections/onboarding/footer";

interface RestaurantInfo {
  name: string;
}

interface Branch {
  id: string;
  name: string;
  location: string;
}

type OnboardingStep = "restaurant-info" | "branches" | "complete";

const Onboarding = () => {
  const [currentStep, setCurrentStep] =
    useState<OnboardingStep>("restaurant-info");
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo | null>(
    null
  );
  const [branches, setBranches] = useState<Branch[]>([]);

  const steps = [
    { key: "restaurant-info", label: "Restaurant Info" },
    { key: "branches", label: "Branches" },
    { key: "complete", label: "Complete" },
  ];
  const handleRestaurantInfoComplete = (data: RestaurantInfo) => {
    setRestaurantInfo(data);
    setCurrentStep("branches");
  };

  const handleBranchesComplete = (branchList: Branch[]) => {
    setBranches(branchList);
    setCurrentStep("complete");
  };

  const handleSelectBranch = (branchId: string) => {
    // Navigate to dashboard with selected branch
    // router.push(`/dashboard/${branchId}`);
  };

  return (
    <div className="min-h-screen relative overflow-hidden pb-9">
      <OnboardingBackgroundPattern />

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Progress Indicator */}
        <div className="max-w-2xl mx-auto mb-12">
          <ProgressBar steps={steps} currentStep={currentStep} />
        </div>

        {/* Step Content */}
        {currentStep === "restaurant-info" && (
          <RestaurantInfoStep
            onComplete={handleRestaurantInfoComplete}
            initialData={restaurantInfo || undefined}
          />
        )}

        {currentStep === "branches" && restaurantInfo && (
          <BranchesStep
            onComplete={handleBranchesComplete}
            onBack={() => setCurrentStep("restaurant-info")}
            restaurantName={restaurantInfo.name}
          />
        )}

        {currentStep === "complete" && restaurantInfo && (
          <CompletionStep
            restaurantName={restaurantInfo.name}
            branches={branches}
            onSelectBranch={handleSelectBranch}
          />
        )}
      </div>
      <OnboardingFooter />
    </div>
  );
};

export default Onboarding;

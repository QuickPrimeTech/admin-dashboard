"use client";

import { useState } from "react";
import { RestaurantInfoStep } from "@/sections/onboarding/restaurant-info-step";
import { BranchesStep } from "@/sections/onboarding/branches-step";
import { CompletionStep } from "@/sections/onboarding/completion-step";
import { OnboardingBackgroundPattern } from "@/components/background-patterns/onboarding-pattern";

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
    <div className="min-h-screen relative overflow-hidden">
      <OnboardingBackgroundPattern />

      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Progress Indicator */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-between">
            {[
              { key: "restaurant-info", label: "Restaurant Info" },
              { key: "branches", label: "Branches" },
              { key: "complete", label: "Complete" },
            ].map((step, index) => (
              <div key={step.key} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      currentStep === step.key
                        ? "bg-primary text-primary-foreground shadow-lg scale-110"
                        : index <
                          ["restaurant-info", "branches", "complete"].indexOf(
                            currentStep
                          )
                        ? "bg-success text-success-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="text-xs mt-2 font-medium hidden sm:block">
                    {step.label}
                  </span>
                </div>
                {index < 2 && (
                  <div
                    className={`h-1 flex-1 mx-2 rounded transition-all ${
                      index <
                      ["restaurant-info", "branches", "complete"].indexOf(
                        currentStep
                      )
                        ? "bg-success"
                        : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
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
    </div>
  );
};

export default Onboarding;

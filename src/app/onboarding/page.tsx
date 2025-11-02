"use client";
import { useState } from "react";
import { BranchCard } from "@/sections/onboarding/branch-card";
import { Branch } from "@/types/onboarding";
import { AddBranchCard } from "@/sections/onboarding/add-branch-card";
import { OnboardingFooter } from "@/sections/onboarding/footer";
import { AddBranchDialog } from "@/sections/onboarding/add-branch-dialog";

export default function OnboardingFlow() {
  const [branches, setBranches] = useState<Branch[] | null>(null);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 md:px-8 py-12 max-w-6xl">
        {/* Header Section */}
        <div className="mb-12 space-y-2">
          <h1 className="text-2xl lg:text-4xl font-bold">
            Welcome to Your Restaurant Dashboard
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Let's get your restaurant set up in minutes. Start by creating your
            first branch location.
          </p>
        </div>

        {/* Branches Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {branches && branches.map((branch) => <BranchCard branch={branch} />)}
          <AddBranchDialog />
        </div>
        {/* Footer Help Text */}
        <OnboardingFooter />
      </div>
    </div>
  );
}

"use client";

import { BranchCard } from "@/sections/onboarding/branch-card";
import { OnboardingFooter } from "@/sections/onboarding/footer";
import { AddBranchDialog } from "@/sections/onboarding/add-branch-dialog";
import { useBranchesQuery } from "@/hooks/use-branches";
import { BranchCardSkeleton } from "@/sections/onboarding/skeletons/branch-card-skeleton";
import { AddBranchCardSkeleton } from "@/sections/onboarding/skeletons/add-branch-card-skeleton";

export default function OnboardingFlow() {
  const { data: branches, isPending } = useBranchesQuery();

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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <BranchCardSkeleton />
          <AddBranchCardSkeleton />
        </div>
        {/* Branches Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {branches &&
            branches.map((branch) => (
              <BranchCard key={branch.id} branch={branch} />
            ))}
          <AddBranchDialog />
        </div>
        {/* Footer Help Text */}
        <OnboardingFooter />
      </div>
    </div>
  );
}

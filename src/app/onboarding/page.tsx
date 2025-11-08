"use client";

import { BranchCard } from "@/sections/onboarding/branch-card";
import { OnboardingFooter } from "@/sections/onboarding/footer";
import { AddBranchDialog } from "@/sections/onboarding/add-branch-dialog";
import { useBranchesQuery } from "@/hooks/use-branches";
import { BranchCardSkeleton } from "@/sections/onboarding/skeletons/branch-card-skeleton";
import { AddBranchCardSkeleton } from "@/sections/onboarding/skeletons/add-branch-card-skeleton";
import { LogOutButton } from "@/components/logout-button";

export default function OnboardingFlow() {
  const { data: branches, isPending } = useBranchesQuery();

  return (
    <div className="min-h-screen">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 h-full opacity-80 dark:opacity-5"
        style={{
          backgroundImage: `
        linear-gradient(to right, rgba(229,231,235,0.8) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(229,231,235,0.8) 1px, transparent 1px),
        radial-gradient(circle 500px at 20% 80%, rgba(139,92,246,0.3), transparent),
        radial-gradient(circle 500px at 80% 20%, rgba(59,130,246,0.3), transparent)
      `,
          backgroundSize: "48px 48px, 48px 48px, 100% 100%, 100% 100%",
        }}
      />
      <div className="relative z-10 container mx-auto px-4 md:px-8 py-12 max-w-6xl">
        {/* Header Section */}
        <div className="flex flex-col max-sm:items-end md:flex-row-reverse justify-between gap-2">
          <LogOutButton />
          <div className="mb-12 space-y-2">
            <h1 className="text-2xl lg:text-4xl font-bold">
              Welcome to Your Restaurant Dashboard
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Let's get your restaurant set up in minutes. Start by creating
              your first branch location.
            </p>
          </div>
        </div>
        {isPending ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {Array.from({ length: 2 }).map((_, index) => (
              <BranchCardSkeleton key={index} />
            ))}
            <AddBranchCardSkeleton />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {branches &&
              branches.map((branch) => (
                <BranchCard key={branch.id} branch={branch} />
              ))}
            <AddBranchDialog />
          </div>
        )}
        <OnboardingFooter />
      </div>
    </div>
  );
}

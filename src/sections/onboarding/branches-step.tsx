"use client";
import { Button } from "@ui/button";
import { ArrowRight } from "lucide-react";
import { OnboardingStep, RestaurantInfo } from "@/types/onboarding";
import { BranchCard } from "./branch-card";
import { useBranchesQuery, useOnboardUser } from "@/hooks/use-branches";
import { BranchCardSkeleton } from "./skeletons/branch-card-skeleton";
import { BranchCardError } from "./error/branch-card-error";
import { AddBranchCard } from "./add-branch-card";

interface BranchesStepProps {
  onComplete: (data: RestaurantInfo | null, nextStep: OnboardingStep) => void;
  onBack: () => void;
  restaurantName: string;
}

export function BranchesStep({
  onComplete,
  onBack,
  restaurantName,
}: BranchesStepProps) {
  //Getting the data using the fetch query
  const { data: branches, isPending, isError, refetch } = useBranchesQuery();
  const setOnboardedMutation = useOnboardUser();

  //Mutation function to mark the user has onboarded
  const handleCompleteOnboarding = () => {
    setOnboardedMutation.mutate(undefined, {
      onSuccess: () => {
        //Take the user to the next step
        onComplete(null, "complete");
      },
    });
  };
  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold">Set Up Your Branches</h2>
        <p className="text-muted-foreground text-lg">
          To continue please add at least one branch location for{" "}
          <span className="font-semibold text-foreground">
            {restaurantName}
          </span>
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:px-4">
        {isPending &&
          Array.from({ length: 3 }).map((_, i) => (
            <BranchCardSkeleton key={i} />
          ))}

        {isError && <BranchCardError refetch={refetch} />}
        {branches &&
          branches.map((branch) => (
            <BranchCard key={branch.id} branch={branch} />
          ))}
        <AddBranchCard />
      </div>

      <div className="flex justify-between pt-6 lg:px-4">
        <Button variant="outline" size="lg" onClick={onBack}>
          Back
        </Button>
        <Button
          size="lg"
          onClick={handleCompleteOnboarding}
          disabled={isPending || isError || !branches || branches.length === 0}
        >
          Continue to Dashboard
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
}

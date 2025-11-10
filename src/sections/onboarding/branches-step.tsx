import { useState } from "react";
import { Button } from "@ui/button";
import { Card, CardContent } from "@ui/card";
import { Plus, ArrowRight } from "lucide-react";
import { BranchFormDialog } from "./branch-form-dialog";
import { Branch, OnboardingStep, RestaurantInfo } from "@/types/onboarding";
import { BranchCard } from "./branch-card";
import { useBranchesQuery, useOnboardUser } from "@/hooks/use-branches";
import { BranchCardSkeleton } from "./skeletons/branch-card-skeleton";
import { BranchCardError } from "./error/branch-card-error";

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

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

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
            <BranchCard
              key={branch.id}
              branch={branch}
              setEditingBranch={setEditingBranch}
              setIsAddDialogOpen={setIsAddDialogOpen}
            />
          ))}
        <Card
          className="border-dashed border-2 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group"
          onClick={() => {
            setEditingBranch(null);
            setIsAddDialogOpen(true);
          }}
        >
          <CardContent className="flex flex-col items-center justify-center h-full min-h-40 text-center p-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mb-3 transition-colors">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <p className="font-semibold text-foreground">Add Branch</p>
            <p className="text-sm text-muted-foreground mt-1">
              Create a new location
            </p>
          </CardContent>
        </Card>
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

      <BranchFormDialog
        open={isAddDialogOpen}
        branchData={editingBranch}
        onOpenChange={setIsAddDialogOpen}
        mode={editingBranch ? "edit" : "create"}
      />
    </div>
  );
}

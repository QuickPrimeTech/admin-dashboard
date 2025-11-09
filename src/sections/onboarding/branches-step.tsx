import { useState } from "react";
import { Button } from "@ui/button";
import { Card, CardContent } from "@ui/card";
import { Plus, ArrowRight } from "lucide-react";
import { BranchFormDialog } from "./branch-form-dialog";
import { celebrateSuccess, ConfettiEffect } from "@/components/confetti-effect";
import { toast } from "sonner";
import { Branch } from "@/types/onboarding";
import { BranchCard } from "./branch-card";

interface BranchesStepProps {
  onComplete: (branches: Branch[]) => void;
  onBack: () => void;
  restaurantName: string;
}

export function BranchesStep({
  onComplete,
  onBack,
  restaurantName,
}: BranchesStepProps) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [deletingBranch, setDeletingBranch] = useState<Branch | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleDeleteBranch = (id: string) => {
    console.log(`You are about to delete branch with the id ${id}`);
    setBranches(branches.filter((b) => b.id !== id));
    setDeletingBranch(null);
    toast.success("Branch deleted successfully!");
  };

  const handleContinue = () => {
    celebrateSuccess();
    setTimeout(() => onComplete(branches), 500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <ConfettiEffect trigger={showConfetti} duration={2000} />

      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold">Set Up Your Branches</h2>
        <p className="text-muted-foreground text-lg">
          To continue please add at least one branch location for{" "}
          <span className="font-semibold text-foreground">
            {restaurantName}
          </span>
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {branches.map((branch) => (
          <BranchCard
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

      <div className="flex justify-between pt-6">
        <Button variant="outline" size="lg" onClick={onBack}>
          Back
        </Button>
        <Button
          size="lg"
          onClick={handleContinue}
          disabled={branches.length === 0}
          className="shadow-lg hover:shadow-xl transition-all"
        >
          Continue to Dashboard
          <ArrowRight className="ml-2 h-5 w-5" />
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

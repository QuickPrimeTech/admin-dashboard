import { useState } from "react";
import { Button } from "@ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { MapPin, Plus, Edit2, Trash2, ArrowRight } from "lucide-react";
import { BranchFormDialog } from "./branch-form-dialog";
import { celebrateSuccess, ConfettiEffect } from "@/components/confetti-effect";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@ui/alert-dialog";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { Branch } from "@/types/onboarding";

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

  const handleAddBranch = (values: { name: string; location: string }) => {
    const newBranch: Branch = {
      id: crypto.randomUUID(),
      name: values.name,
      location: values.location,
    };
    setBranches([...branches, newBranch]);
    setIsAddDialogOpen(false);
    setShowConfetti(true);
    toast.success("Branch added successfully!", {
      description: `${values.name} at ${values.location} has been added.`,
    });
    setTimeout(() => setShowConfetti(false), 100);
  };

  const handleEditBranch = (values: { name: string; location: string }) => {
    if (!editingBranch) return;
    setBranches(
      branches.map((b) =>
        b.id === editingBranch.id
          ? { ...b, name: values.name, location: values.location }
          : b
      )
    );
    setEditingBranch(null);
    toast.success("Branch updated successfully!");
  };

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
          <Card key={branch.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-primary" />
                {branch.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {branch.location}
              </p>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  setIsAddDialogOpen(() => true);
                  setEditingBranch(() => branch);
                }}
              >
                <Edit2 />
                Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-destructive hover:text-destructive"
                  >
                    <Trash2 />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete{" "}
                      <strong>{deletingBranch?.name}</strong> and all associated
                      data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteBranch(branch.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        ))}

        <Card
          className="border-dashed border-2 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group"
          onClick={() => setIsAddDialogOpen(true)}
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
        onSubmit={handleAddBranch}
        mode={editingBranch ? "edit" : "create"}
      />
    </div>
  );
}

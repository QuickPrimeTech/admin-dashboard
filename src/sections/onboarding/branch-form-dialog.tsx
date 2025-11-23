"use client";

import { Button } from "@ui/button";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@ui/dialog";
import { Input } from "@ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@ui/form";
import { Plus, Edit } from "lucide-react";
import { useEffect } from "react";
import { BranchFormValues, branchSchema } from "@/schemas/onboarding";
import { Branch } from "@/types/onboarding";
import {
  useCreateBranchMutation,
  useUpdateBranchMutation,
} from "@/hooks/use-branches";
import { celebrateSuccess } from "@/components/confetti-effect";
import { Spinner } from "@ui/spinner";

type BranchFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branchData: Branch | null;
  mode?: "create" | "edit";
};

export function BranchFormDialog({
  open,
  onOpenChange,
  branchData,
  mode = "create",
}: BranchFormDialogProps) {
  // Select the appropriate mutation based on mode
  const createMutation = useCreateBranchMutation();
  const updateMutation = useUpdateBranchMutation();
  const mutation = mode === "create" ? createMutation : updateMutation;

  const initialState: BranchFormValues = { name: "", location: "" };

  const form = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema),
    defaultValues: initialState,
  });

  // Sync form when external branchData changes
  useEffect(() => {
    if (branchData) {
      form.reset({
        name: branchData.name ?? "",
        location: branchData.location ?? "",
      });
      return;
    }
    form.reset(initialState);
  }, [branchData, form]);

  const handleSubmit = async (values: BranchFormValues) => {
    if (mode === "create") {
      createMutation.mutate(values, {
        onSuccess: () => {
          celebrateSuccess();
          form.reset(initialState);
          onOpenChange(false);
        },
      });
    } else {
      if (branchData) {
        updateMutation.mutate(
          { ...branchData, ...values },
          {
            onSuccess: () => {
              celebrateSuccess();
              onOpenChange(false);
            },
          }
        );
      }
    }
  };

  const isEdit = mode === "edit";
  const isPending = mutation.isPending;
  const buttonText = isPending
    ? isEdit
      ? "Updating Branch..."
      : "Creating Branch..."
    : isEdit
    ? "Update Branch"
    : "Create Branch";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Branch" : "Create New Branch"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the branch details below."
              : "Fill in the details below to add a branch."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Downtown Location"
                      className="h-11"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., 123 Main St, New York, NY"
                      className="h-11"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isPending || !form.formState.isDirty}
              >
                {isPending ? <Spinner /> : isEdit ? <Edit /> : <Plus />}
                {buttonText}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

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

type BranchFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: BranchFormValues) => void | Promise<void>;
  branchData: Branch | null;
  mode?: "create" | "edit";
};

export function BranchFormDialog({
  open,
  onOpenChange,
  onSubmit,
  branchData,
  mode = "create",
}: BranchFormDialogProps) {
  const form = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      name: branchData?.name ?? "",
      location: branchData?.location ?? "",
    },
  });

  // Sync form when external branchData changes
  useEffect(() => {
    if (branchData) {
      form.reset(branchData); // keepDirtyValues: false by default
    } else {
      form.reset({ name: "", location: "" });
    }
  }, [branchData, form]);

  const handleSubmit = async (values: BranchFormValues) => {
    await onSubmit(values);
    if (mode === "create") form.reset({ name: "", location: "" });
  };

  const isEdit = mode === "edit";

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
              <Button type="submit">
                {isEdit ? (
                  <>
                    <Edit className="mr-2 h-4 w-4" />
                    Update Branch
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Branch
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

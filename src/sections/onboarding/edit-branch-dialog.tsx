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
import { BranchFormValues, branchSchema } from "@/schemas/onboarding";
import { Edit } from "lucide-react";
import { Branch } from "@/types/onboarding";
import { Dispatch, SetStateAction } from "react";

type EditBranchDialogProps = {
  branch: Branch;
  onEdit: (branch: { name: string }) => void;
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
};

export function EditBranchDialog({
  branch,
  onEdit,
  open,
  onOpenChange,
}: EditBranchDialogProps) {
  const form = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema),
    defaultValues: { name: branch.name },
  });

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="sm:max-w-[425px]"
          aria-describedby="add branch dialog"
        >
          <DialogHeader>
            <DialogTitle>Create New Branch</DialogTitle>
            <DialogDescription>
              Fill in the details below to add a branch.
            </DialogDescription>
          </DialogHeader>

          {/* Form using React Hook Form + Zod */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onEdit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Write branch name here..."
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
                  <Edit />
                  Update Branch
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

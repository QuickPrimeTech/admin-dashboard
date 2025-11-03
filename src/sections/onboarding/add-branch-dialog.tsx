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
import { AddBranchCard } from "./add-branch-card";
import { useState } from "react";
import { Plus } from "lucide-react";
import { createBranchMutation } from "@/hooks/use-branches";

export function AddBranchDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const form = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema),
    defaultValues: { name: "" },
  });

  //Importing the mutation from tanstack query
  const mutation = createBranchMutation();

  const onSubmit = async (values: BranchFormValues) => {
    await mutation.mutateAsync(values);
    form.reset();
    setIsDialogOpen(false);
  };

  return (
    <>
      <AddBranchCard onClick={() => setIsDialogOpen(true)} />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  <Plus />
                  Create Branch
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

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
import { z } from "zod";
import { Plus, Edit } from "lucide-react";

const branchSchema = z.object({
  name: z.string().min(2, "Branch name must be at least 2 characters"),
  location: z.string().min(2, "Location is required"),
});

type BranchFormValues = z.infer<typeof branchSchema>;

interface BranchFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: BranchFormValues) => void | Promise<void>;
  defaultValues?: BranchFormValues;
  mode?: "create" | "edit";
}

export function BranchFormDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  mode = "create",
}: BranchFormDialogProps) {
  const form = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema),
    defaultValues: defaultValues || { name: "", location: "" },
  });

  const handleSubmit = async (values: BranchFormValues) => {
    await onSubmit(values);
    if (mode === "create") {
      form.reset();
    }
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

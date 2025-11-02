"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@ui/card";
import { Button } from "@ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogFooter,
} from "@ui/dialog";
import { Input } from "@ui/input";
import { Dispatch, SetStateAction } from "react";
import { Plus } from "lucide-react";
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
import { Branch } from "@/types/onboarding";
import { BranchFormValues, branchSchema } from "@/schemas/onboarding";

type AddBranchDialogProps = {
  isDialogOpen: boolean;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
  branches: Branch[];
  onAddBranch: (branch: Branch) => void;
};

export function AddBranchDialog({
  isDialogOpen,
  setIsDialogOpen,
  branches,
  onAddBranch,
}: AddBranchDialogProps) {
  const form = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema),
    defaultValues: { name: "", location: "" },
  });

  const onSubmit = (values: BranchFormValues) => {
    const newBranch: Branch = {
      id: crypto.randomUUID(),
      name: values.name,
      location: values.location,
    };

    onAddBranch(newBranch);
    form.reset();
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Card className="w-full max-w-md border-border shadow-lg hover:shadow-xl transition-all cursor-pointer hover:border-primary/50">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold mb-2">
              {branches?.length === 0
                ? "Create Your First Branch"
                : "Add Another Branch"}
            </CardTitle>
            <CardDescription className="text-base">
              Add your restaurant location to begin managing operations
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center pb-8">
            <Button
              size="lg"
              className="rounded-full w-20 h-20 shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <Plus className="w-10 h-10" />
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Click to add a new branch
            </p>
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Branch</DialogTitle>
          <DialogDescription>
            Add a new restaurant branch to your dashboard. Fill in the details
            below.
          </DialogDescription>
        </DialogHeader>

        {/* Form using React Hook Form + Zod */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Downtown Location" {...field} />
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
                    <Input placeholder="123 Main St, City, State" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Branch</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// @/components/branch-settings/basic-info-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BasicInfoData, basicInfoSchema } from "@/schemas/branch-settings";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@ui/form";
import { Switch, SwitchSkeleton } from "@ui/switch";
import { Button } from "@ui/button";
import { Save, Store } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@ui/input-group";
import { useGetCurrentBranch } from "@/hooks/use-branches";
import { useBranch } from "@/components/providers/branch-provider";
import { useEffect } from "react";
import { InputSkeleton } from "@ui/input";
import { OpeningHoursDialog } from "./opening-hours-dialog";
import { useUpdateSettings } from "@/hooks/use-settings";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

export function BasicInfoForm() {
  const { branchId } = useBranch();
  const { data: branch, isPending } = useGetCurrentBranch(branchId);
  // Initialize mutation
  const updateSettings = useUpdateSettings(branchId);
  const isSubmitting = updateSettings.isPending;

  const form = useForm<BasicInfoData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      name: "",
      is_open: true,
      opening_hours: [],
    },
  });

  useEffect(() => {
    if (!branch) return;
    form.reset({
      name: branch.name,
      is_open: branch.is_open,
      // Handle both string (legacy) and array (new) formats safely
      opening_hours: Array.isArray(branch.opening_hours)
        ? branch.opening_hours
        : [],
    });
  }, [branch, form]);

  const onSubmit = async (values: BasicInfoData) => {
    await updateSettings.mutateAsync(values, {
      onSuccess: () => {
        toast.success("Settings updated successfully");
      },
      onError: () => {
        toast.error("Failed to save changes. Please try again.");
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Branch Information</CardTitle>
            <CardDescription>
              Basic information about your branch.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch Name</FormLabel>
                    <FormControl>
                      {isPending ? (
                        <InputSkeleton />
                      ) : (
                        <InputGroup>
                          <InputGroupInput
                            placeholder="Enter branch name"
                            {...field}
                          />
                          <InputGroupAddon>
                            <Store />
                          </InputGroupAddon>
                        </InputGroup>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_open"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Currently Open
                      </FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Toggle branch open/closed status
                      </div>
                    </div>
                    <FormControl>
                      {isPending ? (
                        <SwitchSkeleton />
                      ) : (
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="opening_hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opening Hours</FormLabel>
                  <FormControl>
                    {isPending ? (
                      <div className="h-10 bg-muted animate-pulse rounded-md" />
                    ) : (
                      <OpeningHoursDialog
                        value={field.value || []}
                        onChange={field.onChange}
                      />
                    )}
                  </FormControl>
                  <FormDescription>
                    Set your weekly operating schedule
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="justify-end">
            <Button
              disabled={!form.formState.isDirty || isSubmitting}
              type="submit"
            >
              {isSubmitting ? <Spinner /> : <Save />}
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

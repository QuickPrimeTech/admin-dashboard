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

export function BasicInfoForm() {
  const { branchId } = useBranch();
  const { data: branch, isPending } = useGetCurrentBranch(branchId);

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

  const onSubmit = (values: BasicInfoData) => {
    // This will be a JSONB array ready for Supabase
    console.log("Submitting values:", values);
    // console.log(
    //   "Opening hours as JSONB:",
    //   JSON.stringify(values.opening_hours),
    // );
    // TODO: Send to your API/mutation
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
            <Button disabled={!form.formState.isDirty} type="submit">
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

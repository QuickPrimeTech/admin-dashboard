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
} from "@ui/form";
import { Textarea, TextareaSkeleton } from "@ui/textarea";
import { Switch, SwitchSkeleton } from "@ui/switch";
import { Button } from "@/components/ui/button";
import { Save, Store } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useGetCurrentBranch } from "@/hooks/use-branches";
import { useBranch } from "@/components/providers/branch-provider";
import { useEffect } from "react";
import { InputSkeleton } from "@/components/ui/input";

export function BasicInfoForm() {
  //Get the branc Id from the context
  const { branchId } = useBranch();

  //Get the current branch Info
  const { data: branch, isPending } = useGetCurrentBranch(branchId);

  const defaultValues: BasicInfoData = {
    name: "",
    is_open: true,
    opening_hours: "",
  };

  const form = useForm<BasicInfoData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!branch) return;
    form.reset({
      name: branch.name,
      is_open: branch.is_open,
      opening_hours: branch.opening_hours,
    });
  }, [branch]);

  const onSubmit = (values: BasicInfoData) => {
    console.log(
      "You are about to submit the following values ---------->",
      values
    );
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
                      <TextareaSkeleton />
                    ) : (
                      <Textarea
                        placeholder="Mon-Fri: 11:00 AM - 10:00 PM&#10;Sat-Sun: 10:00 AM - 11:00 PM"
                        className="resize-none"
                        {...field}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="justify-end">
            <Button disabled={!form.formState.isDirty}>
              <Save /> Save Changes
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

"use client";

import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { AvailabilityFormData, availabilitySchema } from "@/schemas/menu";
import { useMenuItemForm } from "@/contexts/menu/edit-menu-item";
import { AvailabilitySkeleton } from "@/sections/menu/skeletons/availability-skeleton";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import axios from "axios";

export default function AvailabilitySection() {
  const { data: serverData, status } = useMenuItemForm();

  const defaultData: AvailabilityFormData = {
    is_available: true,
    is_popular: false,
    start_time: "00:00",
    end_time: "23:59",
  };

  const form = useForm<AvailabilityFormData>({
    resolver: zodResolver(availabilitySchema) as Resolver<AvailabilityFormData>,
    defaultValues: defaultData,
  });

  // ✅ Prefill data when fetched
  useEffect(() => {
    if (serverData) {
      // when you reset / pre-fill
      form.reset({
        is_available: serverData.is_available ?? true,
        is_popular: serverData.is_popular ?? false,
        start_time: serverData.start_time?.slice(0, 5) ?? "00:00", // drop seconds
        end_time: serverData.end_time?.slice(0, 5) ?? "23:59",
      });
    }
  }, [serverData, form]);

  // ✅ Show skeletons while loading
  if (status === "pending") {
    return <AvailabilitySkeleton />;
  }

  const onSubmit = (data: AvailabilityFormData) => {
    const payload = new FormData();

    Object.keys(form.formState.dirtyFields).forEach((key) => {
      const value = data[key as keyof AvailabilityFormData];
      payload.append(
        key,
        typeof value === "object" ? JSON.stringify(value) : String(value)
      );
    });
    //Appending the id so that the server can know which image to edit
    payload.append("id", serverData?.id!);
    axios
      .patch("/api/menu-items", payload)
      .then((res) => toast.success(res.data.message))
      .catch(() =>
        toast.error("There was an error updating the availability data")
      );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Availability</CardTitle>
        <CardDescription>
          Set when this item is available for ordering
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            {/* Availability Switch */}
            <FormField
              control={form.control}
              name="is_available"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border border-border p-4 bg-card">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Item Available</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Toggle to control if this item is available for ordering
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Popular Switch */}
            <FormField
              control={form.control}
              name="is_popular"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border border-border p-4 bg-card">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Is Popular</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Toggle to control if this item appears in the popular
                      section
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Time Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available From</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Until</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end pt-4 border-t border-border">
              <Button type="submit" disabled={!form.formState.isDirty}>
                <Edit /> Update Availability
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

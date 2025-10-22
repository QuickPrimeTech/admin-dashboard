"use client";

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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { z } from "zod";
import { AvailabilityFormData, availabilitySchema } from "@/schemas/menu";

export default function AvailabilitySection() {
  const form = useForm<AvailabilityFormData>({
    resolver: zodResolver(availabilitySchema) as Resolver<
      AvailabilityFormData,
      any
    >,
    defaultValues: {
      is_available: true,
      start_time: "08:00",
      end_time: "22:00",
    },
  });

  const onSubmit = (data: AvailabilityFormData) => {
    console.log("✅ Availability submitted:", data);
    toast.success("Availability settings saved successfully!");
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
                  </FormItem>
                )}
              />
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t border-border">
              <Button type="submit">Save Availability</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

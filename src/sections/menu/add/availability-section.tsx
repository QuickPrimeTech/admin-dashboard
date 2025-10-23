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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { AvailabilityFormData, availabilitySchema } from "@/schemas/menu";
import { useMenuItemForm } from "@/contexts/add-menu-item";
import { useEffect } from "react";

export default function AvailabilitySection() {
  const { availabilityInfo, setAvailabilityInfo } = useMenuItemForm();
  const form = useForm<AvailabilityFormData>({
    resolver: zodResolver(availabilitySchema) as Resolver<AvailabilityFormData>,
    defaultValues: {
      is_available: true,
      start_time: "",
      end_time: "",
    },
  });

  useEffect(() => {
    if (availabilityInfo) {
      form.reset(availabilityInfo);
    }
  }, [availabilityInfo, form]);

  const onSubmit = (data: AvailabilityFormData) => {
    setAvailabilityInfo(data);
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

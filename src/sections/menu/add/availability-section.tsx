import { UseFormReturn } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { MenuItemFormData } from "@/schemas/menu";
import { toast } from "sonner";

interface AvailabilitySectionProps {
  form: UseFormReturn<MenuItemFormData>;
}

export default function AvailabilitySection({
  form,
}: AvailabilitySectionProps) {
  const handleSave = async () => {
    const isValid = await form.trigger(["start_time", "end_time"]);
    if (isValid) {
      toast.success("Your availability settings have been saved successfully.");
    }
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
        <div className="space-y-4">
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

          <div className="flex justify-end pt-4 border-t border-border">
            <Button onClick={handleSave} type="button">
              Save Availability
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

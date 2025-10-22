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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MenuItemFormData } from "@/schemas/menu";
import { toast } from "sonner";

interface BasicInfoSectionProps {
  form: UseFormReturn<MenuItemFormData>;
}

export default function BasicInfoSection({ form }: BasicInfoSectionProps) {
  const handleSave = async () => {
    const isValid = await form.trigger(["name", "price", "category"]);
    if (isValid) {
      toast("Basic Info Saved", {
        description: "Your basic information has been saved successfully.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Basic Information</CardTitle>
        <CardDescription>
          Enter the essential details about your menu item
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Item Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Buffalo Style Jumbo Chicken Wings"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        type="number"
                        placeholder="13.95"
                        step="0.01"
                        min="0"
                        className="pl-7"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseFloat(e.target.value) : 0
                          )
                        }
                        value={field.value || ""}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="appetizers">Appetizers</SelectItem>
                      <SelectItem value="mains">Main Courses</SelectItem>
                      <SelectItem value="sides">Sides</SelectItem>
                      <SelectItem value="desserts">Desserts</SelectItem>
                      <SelectItem value="beverages">Beverages</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your dish, ingredients, and preparation..."
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Optional but recommended for better customer engagement
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end pt-4 border-t border-border">
            <Button onClick={handleSave} type="button">
              Save Basic Info
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

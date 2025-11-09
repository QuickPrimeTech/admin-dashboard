import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/form";
import { Input } from "@ui/input";
import { Card } from "@ui/card";
import { Store } from "lucide-react";
import { celebrateSuccess } from "@/components/confetti-effect";
import { RestaurantFormValues, restaurantSchema } from "@/schemas/onboarding";
import { createRestaurantMutation } from "@/hooks/use-branches";

type RestaurantInfoStepProps = {
  onComplete: (data: RestaurantFormValues) => void;
  initialData?: RestaurantFormValues;
};

export function RestaurantInfoStep({
  onComplete,
  initialData,
}: RestaurantInfoStepProps) {
  // Mutation function from tanstack
  const createMutation = createRestaurantMutation();

  const form = useForm<RestaurantFormValues>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: initialData || {
      name: "",
    },
  });

  const handleSubmit = (values: RestaurantFormValues) => {
    celebrateSuccess();
    console.log(
      "You are about to submit the restaurant name as " + values.name
    );
    createMutation.mutateAsync(values.name);
    onComplete(values);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto rounded-full bg-linear-to-br from-primary to-primary-glow flex items-center justify-center shadow-lg">
          <Store className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold">
          Welcome to Your Restaurant Dashboard
        </h2>
        <p className="text-muted-foreground text-lg">
          Let's start by creating your restaurant. You'll add branch locations
          next.
        </p>
      </div>

      <Card className="p-8 shadow-lg border-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Restaurant Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., The Golden Palace Restaurant"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" size="lg" className="w-full">
              Continue to Branch Setup
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}

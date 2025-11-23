"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@ui/input-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/form";
import { ChefHat, Save, User } from "lucide-react";
import {
  useCreateRestaurantMutation,
  useRestaurantQuery,
} from "@/hooks/use-restaurant";
import { useEffect, useState } from "react";
import { Skeleton } from "@ui/skeleton";
import { Spinner } from "@ui/spinner";
import { RestaurantFormData, restaurantFormSchema } from "@/schemas/profile";

export function RestaurantForm() {
  const { data: restaurant, isPending } = useRestaurantQuery();
  const [isLoading, setIsLoading] = useState(false);
  const updateMutation = useCreateRestaurantMutation();

  const form = useForm<RestaurantFormData>({
    resolver: zodResolver(restaurantFormSchema),
    defaultValues: {
      name: "",
      owner: "",
    },
  });

  useEffect(() => {
    if (restaurant) {
      form.reset({ name: restaurant.name, owner: restaurant.owner ?? "" });
    }
  }, [restaurant]);

  const onSubmit = (values: RestaurantFormData) => {
    setIsLoading(() => true);
    updateMutation.mutate(
      { name: values.name, owner: values.owner || null },
      {
        onSettled: () => {
          setIsLoading(() => false);
        },
      }
    );
  };
  const InputSkeleton = <Skeleton className="h-9" />;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-6">
        {/* Name */}
        <div className="w-full flex gap-3 flex-col md:flex-row items-start">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full flex-1">
                <FormLabel>Restaurant name</FormLabel>
                <FormControl>
                  {isPending ? (
                    InputSkeleton
                  ) : (
                    <InputGroup>
                      <InputGroupInput
                        placeholder="Enter restaurant name here..."
                        {...field}
                      />
                      <InputGroupAddon>
                        <ChefHat />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Owner */}
          <FormField
            control={form.control}
            name="owner"
            render={({ field }) => (
              <FormItem className="w-full flex-1">
                <FormLabel>Owner</FormLabel>
                <FormControl>
                  {isPending ? (
                    InputSkeleton
                  ) : (
                    <InputGroup>
                      <InputGroupInput
                        placeholder="Enter restaurant owner name here..."
                        {...field}
                      />
                      <InputGroupAddon>
                        <User />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={!form.formState.isDirty || isLoading || isPending}
        >
          {isLoading ? (
            <>
              <Spinner />
              Saving restaurant info…
            </>
          ) : (
            <>
              <Save />
              Save restaurant info
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

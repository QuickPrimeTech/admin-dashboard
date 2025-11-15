"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { useRestaurantQuery } from "@/hooks/use-restaurant";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

/* ------------------------------------------------------------------ */
/* Zod schema – mirrors the table constraints                         */
/* ------------------------------------------------------------------ */
const formSchema = z.object({
  name: z.string().min(1, "Restaurant name is required"),
  owner: z.string().max(50, "Max 50 characters").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */
export function RestaurantForm() {
  const { data: restaurant, isPending } = useRestaurantQuery();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
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

  const onSubmit = (values: FormValues) => {
    console.log("You are about to submit this values --->", values);
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

        <Button type="submit" disabled={!form.formState.isDirty}>
          {form.formState.isSubmitting ? (
            <>
              <Spinner />
              Saving…
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

"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/form";

/* ------------------------------------------------------------------ */
/* Zod schema – mirrors the table constraints                         */
/* ------------------------------------------------------------------ */
const formSchema = z.object({
  name: z.string().min(1, "Restaurant name is required"),
  owner: z.string().max(50, "Max 50 characters").optional().or(z.literal("")),
  avatar_url: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  lqip: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */
export function RestaurantForm({
  defaultValues,
}: {
  defaultValues?: Partial<FormValues>;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      owner: "",
      avatar_url: "",
      lqip: "",
      ...defaultValues,
    },
  });

  const onSubmit = (values: FormValues) => {
    console.log("You are about to submit this values --->", values);
  };

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Restaurant name</FormLabel>
              <FormControl>
                <Input placeholder="The Burger Joint" {...field} />
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
            <FormItem>
              <FormLabel>Owner</FormLabel>
              <FormControl>
                <Input placeholder="Margaret Villard" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Avatar URL */}
        <FormField
          control={form.control}
          name="avatar_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com/avatar.jpg"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* LQIP (blur-up) URL */}
        <FormField
          control={form.control}
          name="lqip"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Blur-up image (LQIP) URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com/hero-lqip.jpg"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save restaurant"}
        </Button>
      </form>
    </Form>
  );
}

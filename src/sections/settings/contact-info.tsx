"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactInfoData, contactInfoSchema } from "@/schemas/branch-settings";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@ui/form";
import { Textarea } from "@ui/textarea";
import { Button } from "@ui/button";
import { Mail, Phone, Save } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@ui/input-group";
import { useBranch } from "@/components/providers/branch-provider";
import { useGetCurrentBranch } from "@/hooks/use-branches";
import { useUpdateSettings } from "@/hooks/use-settings";
import { toast } from "sonner";
import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";

export function ContactInfoForm() {
  const { branchId } = useBranch();
  const { data: branch } = useGetCurrentBranch(branchId);
  // Initialize mutation
  const updateSettings = useUpdateSettings(branchId);
  const isSubmitting = updateSettings.isPending;

  const defaultValues = {
    email: undefined,
    phone: undefined,
    address: undefined,
  };

  const form = useForm<ContactInfoData>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!branch) return;
    form.reset({
      email: branch.email,
      phone: branch.phone,
      address: branch.address,
    });
  }, [branch, form]);

  const onSubmit = async (values: ContactInfoData) => {
    await updateSettings.mutateAsync(values, {
      onSuccess: (res) => {
        toast.success(res.message);
      },
      onError: (error) => {
        toast.error(
          error.response?.data.message ||
            "Failed to save changes. Please try again.",
        );
      },
    });
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="flex-1 w-full">
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <InputGroup>
                        <InputGroupInput
                          placeholder="+254 700 000 000"
                          {...field}
                        />
                        <InputGroupAddon>
                          <Phone />
                        </InputGroupAddon>
                      </InputGroup>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-1 w-full">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <InputGroup>
                        <InputGroupInput
                          placeholder="example@gmail.com"
                          {...field}
                        />
                        <InputGroupAddon>
                          <Mail />
                        </InputGroupAddon>
                      </InputGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="123 Main Street..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <CardFooter className="justify-end">
              <Button
                type="submit"
                disabled={!form.formState.isDirty || isSubmitting}
              >
                {isSubmitting ? <Spinner /> : <Save />}
                {isSubmitting
                  ? "Saving Contact Info..."
                  : "Save Contact Information"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/form";
import { Input } from "@ui/input";
import { Textarea } from "@ui/textarea";
import { BasicInfoFormData, basicInfoSchema } from "@/schemas/menu";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@ui/input-group";
import { useMenuItemForm } from "@/contexts/menu/edit-menu-item";
import { BasicInfoSkeleton } from "../skeletons/basic-info-skeleton";
import { Button } from "@ui/button";
import { Edit } from "lucide-react";
import { useUpdateMenuItemMutation } from "@/hooks/use-menu";
import { Spinner } from "@ui/spinner";
import { DynamicSelect } from "@/components/dynamic-select";

export default function BasicInfoSection() {
  const { data: serverData, status } = useMenuItemForm();
  //Getting the mutation function that updates the menu item
  const { mutate, isPending } = useUpdateMenuItemMutation();
  const form = useForm<BasicInfoFormData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      name: "",
      price: 0,
      category: "",
      description: "",
    },
  });

  useEffect(() => {
    if (serverData) {
      form.reset({
        name: serverData.name || "",
        price: serverData.price || 0,
        category: serverData.category || "",
        description: serverData.description || "",
      });
    }
  }, [serverData, form]);

  // Show skeletons when loading
  if (status === "pending") {
    return <BasicInfoSkeleton />;
  }

  const onSubmit = (data: BasicInfoFormData) => {
    const formData = new FormData();

    Object.keys(form.formState.dirtyFields).forEach((key) => {
      const value = data[key as keyof BasicInfoFormData];
      formData.append(
        key,
        typeof value === "object" ? JSON.stringify(value) : String(value)
      );
    });
    if (!serverData?.id) return;
    //Appending the id so that the server can know which image to edit
    formData.append("id", serverData.id);

    mutate({ formData });
  };

  // Render actual form when loaded
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Basic Information</CardTitle>
        <CardDescription>
          Enter the essential details about your menu item
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
          >
            {/* Item Name */}
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

            {/* Price + Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <InputGroup>
                        <InputGroupAddon>Ksh</InputGroupAddon>
                        <InputGroupInput
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="Enter amount here"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? parseFloat(e.target.value) : 0
                            )
                          }
                          value={field.value || ""}
                        />
                      </InputGroup>
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
                    <DynamicSelect field={field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your dish ingredients"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end pt-4 border-t border-border">
              <Button
                type="submit"
                disabled={!form.formState.isDirty || isPending}
              >
                {isPending ? (
                  <>
                    <Spinner /> Update Basic Info...
                  </>
                ) : (
                  <>
                    <Edit />
                    Update Basic Info
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

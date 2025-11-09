"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui/dialog";
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
import { Button } from "@ui/button";
import { Switch } from "@ui/switch";
import { toast } from "sonner";
import { FAQDialogProps } from "@/types/faqs";

const formSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  is_published: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

export function FAQDialog({
  open,
  onOpenChange,
  faq,
  onSaved,
}: FAQDialogProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      answer: "",
      is_published: true,
    },
  });

  useEffect(() => {
    if (faq) {
      form.reset({
        question: faq.question,
        answer: faq.answer,
        is_published: faq.is_published,
      });
    } else {
      form.reset({
        question: "",
        answer: "",
        is_published: true,
      });
    }
  }, [faq, form]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    const payload = {
      ...data,
      id: faq?.id,
    };

    try {
      if (faq) {
        // PATCH request to update FAQ
        const res = await fetch("/api/faqs", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const result = await res.json();

        if (!res.ok || !result.success) {
          setIsLoading(false);
          toast.error(result.message || "Failed to update FAQ");
        }
        setIsLoading(false);
        toast.success("FAQ updated successfully");
      } else {
        // POST request to create new FAQ
        const res = await fetch("/api/faqs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const result = await res.json();

        if (!res.ok || !result.success) {
          setIsLoading(false);
          toast.error(result.message || "Failed to create FAQ");
        }
        setIsLoading(false);
        toast.success("FAQ created successfully");
      }
      form.reset({
        question: "",
        answer: "",
        is_published: true,
      });
      onSaved();
    } catch (error) {
      setIsLoading(false);
      toast.error(
        `Failed to ${faq ? "update" : "create"} FAQ: ${
          error instanceof Error ? error.message : ""
        }`
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{faq ? "Edit FAQ" : "Add New FAQ"}</DialogTitle>
          <DialogDescription>
            {faq
              ? "Update the FAQ details below."
              : "Fill in the details for the new FAQ."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the question..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Answer</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the answer..."
                      className="resize-none min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_published"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Published</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Make this FAQ visible to customers
                    </div>
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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader className="animate-spin" />
                    {faq ? "Updating" : "Creating"} FAQ
                  </>
                ) : (
                  <>{faq ? "Update" : "Create"} FAQ</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

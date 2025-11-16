"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { FAQDialogProps } from "@/types/faqs";
import { Edit, Plus } from "lucide-react";
import { FaqFormData, faqFormSchema } from "@/schemas/faqs";
import { ScrollArea } from "@radix-ui/react-scroll-area";

export function FAQDialog({
  open,
  onOpenChange,
  faq,
  handleSave,
}: FAQDialogProps) {
  //Mutation for adding faq

  const defaultValues = {
    question: "",
    answer: "",
    is_published: true,
  };

  const form = useForm<FaqFormData>({
    resolver: zodResolver(faqFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (faq) {
      form.reset({
        question: faq.question,
        answer: faq.answer,
        is_published: faq.is_published,
      });
    } else {
      form.reset(defaultValues);
    }
  }, [faq, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] h-[90vh] flex flex-col">
        {/* ------ fixed header ------ */}
        <DialogHeader>
          <DialogTitle>{faq ? "Edit FAQ" : "Add New FAQ"}</DialogTitle>
          <DialogDescription>
            {faq
              ? "Update the FAQ details below."
              : "Fill in the details for the new FAQ."}
          </DialogDescription>
        </DialogHeader>

        {/* ------ scrollable body ------ */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSave)}
            className="flex flex-col flex-1 min-h-0 space-y-4"
          >
            {/* Radix ScrollArea + your fields */}
            <ScrollArea className="flex-1 h-full rounded-md border p-4">
              <div className="space-y-4">
                {/* ----- question ----- */}
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

                {/* ----- answer ----- */}
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

                {/* ----- published switch ----- */}
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
              </div>
            </ScrollArea>

            {/* ------ fixed footer ------ */}
            <DialogFooter className="justify-end flex flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!form.formState.isDirty}>
                {faq ? <Edit /> : <Plus />}
                {faq ? "Update" : "Create"} FAQ
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

"use client";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@ui/card";
import { Button } from "@ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@ui/form";
import {
  Upload,
  X,
  FileText,
  Clock,
  CalendarIcon,
  ImageIcon,
} from "lucide-react";
import { Input } from "@ui/input";
import { Textarea } from "@ui/textarea";
import { Checkbox } from "@ui/checkbox";
import { OfferFormValues, refinedOfferSchema } from "@/schemas/offers";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";
import { format } from "date-fns";
import { Calendar } from "@ui/calendar";
import { cn } from "@/lib/utils";
import { useCreateOfferMutation } from "@/hooks/use-offers";
import { useBranch } from "@providers/branch-provider";
import Image from "next/image";
import { Spinner } from "@ui/spinner";
import { DAYS_OF_WEEK } from "@/constants/offers";

export function OfferForm() {
  //Fetch the branchId from the context
  const { branchId } = useBranch();
  //Mutation for creating offer can be added here
  const createOfferMutation = useCreateOfferMutation();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);

  const form = useForm<OfferFormValues>({
    resolver: zodResolver(refinedOfferSchema),
    defaultValues: {
      title: "",
      description: "",
      startTime: "18:00",
      endTime: "21:00",
      isRecurring: false,
      startDate: new Date(),
      endDate: undefined,
      daysOfWeek: [],
      image: undefined,
    },
  });

  const isRecurring = form.watch("isRecurring");

  const handleDayToggle = (day: number) => {
    const days = form.getValues("daysOfWeek") || [];
    const updatedDays = days.includes(day)
      ? days.filter((d) => d !== day)
      : [...days, day];
    form.setValue("daysOfWeek", updatedDays, { shouldValidate: true });
  };

  const onSubmit = (values: OfferFormValues) => {
    createOfferMutation.mutate(
      { formData: values, branchId: branchId },
      {
        onSuccess: () => {
          form.reset();
          setMediaPreview(null);
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col md:flex-row gap-6"
      >
        {/* Left: 1. Image Card */}
        <div className="md:w-1/3 shrink-0 space-y-6">
          <Card className="md:sticky md:top-28 px-4">
            <CardHeader>
              <CardTitle>
                <ImageIcon className="inline mr-2 h-5 w-5" />
                Offer Image
              </CardTitle>
              <CardDescription>
                Upload an eye-catching **image** for your offer.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 space-y-4 aspect-3/2 relative">
              {mediaPreview ? (
                <Image
                  src={mediaPreview}
                  fill
                  alt="Media Preview"
                  className="rounded-md mb-4"
                />
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex flex-col justify-center items-center h-full border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                >
                  <Upload className="w-8 h-8 mx-auto mb-2 text-foreground-muted" />
                  <p>Click to upload image</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {`Choose an image (JPG, PNG)`}
                  </p>
                </div>
              )}

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setMediaPreview(URL.createObjectURL(file));
                          }
                          field.onChange(file); //  register File object into RHF
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {mediaPreview && (
                <Button
                  variant="destructive"
                  type="button"
                  size={"sm"}
                  className="w-fit absolute bottom-0 right-0"
                  onClick={() => {
                    setMediaPreview(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                >
                  <X />
                  Clear Image
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: 2. Offer Details & 3. Offer Timing */}
        <div className="md:w-2/3 grow space-y-6">
          {/* 2. Offer Details Card (Title & Description) */}
          <Card>
            <CardHeader>
              <CardTitle>
                <FileText className="inline mr-2 h-5 w-5" />
                Offer Details
              </CardTitle>
              <CardDescription>Title and Description</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Offer Title *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., Buy One Get One Pizza"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="e.g., Enjoy two pizzas for the price of one every Tuesday."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* 3. Offer Timing Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Clock className="inline mr-2 h-5 w-5" />
                Offer Timing
              </CardTitle>
              <CardDescription>
                Set the schedule for this offer.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Start Time / End Time (Always visible) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time *</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time *</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Recurring Checkbox */}
              <FormField
                control={form.control}
                name="isRecurring"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          if (checked) {
                            //  CORRECTED: Set to undefined when recurring (clearing one-time dates)
                            form.setValue("startDate", undefined);
                            form.setValue("endDate", undefined);
                          } else {
                            // CORRECTED: Set default date when switching back
                            form.setValue("startDate", new Date());
                            form.setValue("endDate", undefined);
                            form.setValue("daysOfWeek", []);
                          }
                        }}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Repeat Weekly (e.g., Happy Hour)</FormLabel>
                      <FormDescription>
                        Check this for offers that repeat every week. Uncheck
                        for a one-time offer.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {/* Conditional Date Fields (Visible if NOT recurring) */}
              {!isRecurring && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Start Date Picker */}
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date *</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? (
                                  // format() works correctly with Date objects
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a start date</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              // Disabled dates logic works correctly with Date objects
                              disabled={(date: Date) =>
                                date < new Date(new Date().setHours(0, 0, 0, 0))
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* End Date Picker */}
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date (Optional)</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick an end date</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              // ⚠️ CORRECTED: End date logic checks against the Date object from getValues()
                              disabled={(date: Date) => {
                                const startDate = form.getValues("startDate");
                                // Disable dates before the selected start date
                                return !!startDate && date < startDate;
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              {/* Conditional Days of Week Checkboxes (Visible if IS recurring) */}
              {isRecurring && (
                <FormField
                  control={form.control}
                  name="daysOfWeek"
                  render={() => (
                    <FormItem>
                      <FormLabel>Select Days *</FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 border p-4 rounded-md">
                        {DAYS_OF_WEEK.map((day) => (
                          <FormItem
                            key={day.value}
                            className="flex items-center space-x-2"
                          >
                            <FormControl>
                              <Checkbox
                                checked={form
                                  .getValues("daysOfWeek")
                                  ?.includes(day.value)}
                                onCheckedChange={() =>
                                  handleDayToggle(day.value)
                                }
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {day.label}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
          </Card>

          <Button
            type="submit"
            className="w-full"
            disabled={createOfferMutation.isPending}
          >
            {createOfferMutation.isPending ? (
              <>
                <Spinner />
                Creating Offer...
              </>
            ) : (
              "Create Offer"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

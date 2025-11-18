"use client";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Offer } from "./offers-data";
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
} from "@ui/form";
import { Upload, X } from "lucide-react";
import { Input } from "@ui/input";
import { Textarea } from "@ui/textarea";
import { Checkbox } from "@ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";
import { OfferFormValues, offerSchema } from "@/schemas/offers";

interface OfferFormProps {
  onPreviewUpdate: (offer: Partial<Offer>, mediaPreview?: string) => void;
}

const DAYS_OF_WEEK = [
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
  { value: 0, label: "Sunday" },
];

export function OfferForm({ onPreviewUpdate }: OfferFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [mediaPreview, setMediaPreview] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");

  const form = useForm<OfferFormValues>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      title: "",
      description: "",
      discount: "",
      cta: "Order Now",
      status: "active",
      customName: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      daysOfWeek: [],
    },
  });

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const preview = event.target?.result as string;
        setMediaPreview(preview);
        updatePreview(form.getValues(), mediaType === "video");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMediaTypeChange = (type: "image" | "video") => {
    setMediaType(type);
    setMediaPreview("");
    setFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDayToggle = (day: number) => {
    const days = form.getValues("daysOfWeek") || [];
    const updatedDays = days.includes(day)
      ? days.filter((d) => d !== day)
      : [...days, day];
    form.setValue("daysOfWeek", updatedDays);
    updatePreview({ ...form.getValues(), daysOfWeek: updatedDays });
  };

  const updatePreview = (data: any, isVideo?: boolean) => {
    onPreviewUpdate(
      { ...data, isVideo: isVideo ?? mediaType === "video" },
      mediaPreview
    );
  };

  const onSubmit = (values: OfferFormValues) => {
    console.log("Submit offer:", values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col md:flex-row gap-6"
      >
        {/* Left: Media Upload */}
        <div className="md:w-1/3 shrink-0 sticky top-6">
          <Card className="lg:sticky lg:top-28">
            <CardHeader>
              <CardTitle>Media</CardTitle>
              <CardDescription>
                Upload an image or video for your offer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={mediaType}
                onValueChange={(val) =>
                  handleMediaTypeChange(val as "image" | "video")
                }
              >
                <div className="flex gap-4">
                  {(["image", "video"] as const).map((type) => (
                    <FormItem key={type} className="flex items-center gap-2">
                      <FormControl>
                        <RadioGroupItem value={type} />
                      </FormControl>
                      <FormLabel className="capitalize">{type}</FormLabel>
                    </FormItem>
                  ))}
                </div>
              </RadioGroup>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-foreground-muted" />
                <p>Click to upload {mediaType}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {fileName || `Choose a ${mediaType}`}
                </p>
              </div>

              <Input
                ref={fileInputRef}
                type="file"
                accept={mediaType === "image" ? "image/*" : "video/*"}
                onChange={handleMediaUpload}
                className="hidden"
              />

              {mediaPreview && (
                <Button
                  variant="destructive"
                  type="button"
                  className="w-full"
                  onClick={() => {
                    setMediaPreview("");
                    setFileName("");
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear Media
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Form Fields */}
        <div className="md:w-2/3 grow space-y-6">
          {/* Content Card */}
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
              <CardDescription>Offer details and messaging</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Offer Title *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Summer Special" />
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
                        placeholder="Describe your offer..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="discount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount Badge</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., 30% OFF" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cta"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Button Text</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Order Now" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="customName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Name (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Wine Wednesday" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Offer Type & Scheduling */}
          <Card>
            <CardHeader>
              <CardTitle>Offer Type & Scheduling</CardTitle>
              <CardDescription>
                Configure when this offer is available
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Offer Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">
                            Active (Specific Date Range)
                          </SelectItem>
                          <SelectItem value="upcoming">
                            Upcoming (Future Date Range)
                          </SelectItem>
                          <SelectItem value="expired">
                            Expired (Past Offer)
                          </SelectItem>
                          <SelectItem value="recurring">
                            Recurring (Weekly Pattern)
                          </SelectItem>
                          <SelectItem value="scheduled">
                            Scheduled (Regular Weekly Day)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {["active", "upcoming", "expired"].includes(
                form.getValues("status")
              ) && (
                <>
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date (Optional)</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {["recurring", "scheduled"].includes(
                form.getValues("status")
              ) && (
                <FormField
                  control={form.control}
                  name="daysOfWeek"
                  render={() => (
                    <FormItem>
                      <FormLabel>Days of Week</FormLabel>
                      <div className="grid grid-cols-2 gap-2">
                        {DAYS_OF_WEEK.map((day) => (
                          <FormItem
                            key={day.value}
                            className="flex items-center gap-2"
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
                            <FormLabel>{day.label}</FormLabel>
                          </FormItem>
                        ))}
                      </div>
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
          </Card>

          <Button type="submit" className="w-full">
            Create Offer
          </Button>
        </div>
      </form>
    </Form>
  );
}

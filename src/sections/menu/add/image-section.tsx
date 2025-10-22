"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@ui/card";
import { Button } from "@ui/button";
import { cn } from "@/lib/utils";
import { Upload, ImageIcon, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useMenuItemForm } from "@/contexts/add-menu-item";

// ✅ Validation schema (optional image but must be valid type)
const imageSchema = z.object({
  image: z
    .any()
    .refine(
      (file) =>
        !file || (file instanceof File && file.type.startsWith("image/")),
      "Only image files are allowed"
    )
    .optional(),
});

type ImageFormValues = z.infer<typeof imageSchema>;

export function ImageSection() {
  // ✅ Context to store selected image file
  const { setSelectedImage } = useMenuItemForm();

  const form = useForm<ImageFormValues>({
    resolver: zodResolver(imageSchema),
    defaultValues: { image: undefined },
  });

  const { control, setValue, watch, trigger } = form;
  const imageFile = watch("image");
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const [isDragActive, setIsDragActive] = useState(false);

  // ✅ Generate preview
  useEffect(() => {
    if (imageFile instanceof File) {
      const url = URL.createObjectURL(imageFile);
      setPreviewUrl(url);

      // Auto-submit/handle upload
      handleImageUpload(imageFile);

      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(undefined);
    }
  }, [imageFile]);

  // ✅ Simulated upload (replace with actual upload API)
  async function handleImageUpload(file: File) {
    await trigger("image");
    setSelectedImage(file);
  }

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith("image/")) {
      setValue("image", file, { shouldValidate: true });
    }
  };

  const handleRemove = () => {
    setValue("image", undefined);
    setPreviewUrl(undefined);
  };

  // ✅ Drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setIsDragActive(true);
    else if (e.type === "dragleave") setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  return (
    <Form {...form}>
      <Card className="sticky top-16 h-fit">
        <CardHeader>
          <CardTitle className="text-lg">Item Image</CardTitle>
          <CardDescription>
            Upload a beautiful photo of your dish (optional)
          </CardDescription>
        </CardHeader>

        <CardContent>
          <FormField
            control={control}
            name="image"
            render={() => (
              <FormItem>
                <div className="relative aspect-square">
                  {previewUrl ? (
                    <>
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        fill
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={handleRemove}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    </>
                  ) : (
                    <div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      className={cn(
                        "relative rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200",
                        isDragActive
                          ? "border-primary bg-primary/10"
                          : "border-border bg-muted hover:bg-accent/50"
                      )}
                    >
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileSelect(file);
                            e.target.value = "";
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </FormControl>

                      <div className="flex flex-col items-center justify-center gap-3">
                        <div
                          className={cn(
                            "p-3 rounded-full transition-colors",
                            isDragActive
                              ? "bg-primary/20"
                              : "bg-muted-foreground/10"
                          )}
                        >
                          {isDragActive ? (
                            <Upload className="w-6 h-6 text-primary" />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-muted-foreground" />
                          )}
                        </div>

                        <div>
                          <p className="font-semibold text-foreground">
                            {isDragActive
                              ? "Drop your image here"
                              : "Drag and drop your image"}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            or click to browse
                          </p>
                        </div>

                        <p className="text-xs text-muted-foreground/80 mt-2">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </Form>
  );
}

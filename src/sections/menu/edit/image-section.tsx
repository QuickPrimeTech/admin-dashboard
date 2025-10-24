"use client";
import { useState, DragEvent } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Upload, ImageIcon, Trash2 } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@ui/card";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { cn } from "@/lib/utils";

import { Form, FormField, FormItem, FormControl, FormMessage } from "@ui/form";
import { ImageFormValues, imageSchema } from "@/schemas/menu";

export function ImageSection() {
  const form = useForm<ImageFormValues>({
    resolver: zodResolver(imageSchema),
    defaultValues: { image: undefined },
  });

  const { control, setValue, watch, trigger } = form;
  const imageFile = watch("image");

  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const [isDragActive, setIsDragActive] = useState(false);

  // ✅ File selection logic
  function handleFileSelect(file: File) {
    if (file?.type.startsWith("image/")) {
      setValue("image", file, { shouldValidate: true });
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      // ✅ Clean up URL only once
      return () => URL.revokeObjectURL(url);
    }
  }

  // ✅ Remove selected image
  function handleRemove() {
    setValue("image", undefined);
    setPreviewUrl(undefined);
  }

  // ✅ Drag events
  function handleDrag(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(e.type === "dragenter" || e.type === "dragover");
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  }

  return (
    <Form {...form}>
      <Card className="sticky top-16 h-fit">
        <CardHeader>
          <CardTitle className="text-lg">
            Item Image (Highly Recommended)
          </CardTitle>
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
                    <ImagePreview
                      previewUrl={previewUrl}
                      onRemove={handleRemove}
                    />
                  ) : (
                    <ImageDropzone
                      isDragActive={isDragActive}
                      onDrag={handleDrag}
                      onDrop={handleDrop}
                      onFileSelect={handleFileSelect}
                    />
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

/* -------------------------------------------- */
/* Subcomponents for clarity                    */
/* -------------------------------------------- */

function ImagePreview({
  previewUrl,
  onRemove,
}: {
  previewUrl: string;
  onRemove: () => void;
}) {
  return (
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
        onClick={onRemove}
      >
        <Trash2 className="w-4 h-4 mr-1" />
        Remove
      </Button>
    </>
  );
}

function ImageDropzone({
  isDragActive,
  onDrag,
  onDrop,
  onFileSelect,
}: {
  isDragActive: boolean;
  onDrag: (e: DragEvent) => void;
  onDrop: (e: DragEvent) => void;
  onFileSelect: (file: File) => void;
}) {
  return (
    <div
      onDragEnter={onDrag}
      onDragLeave={onDrag}
      onDragOver={onDrag}
      onDrop={onDrop}
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
            if (file) onFileSelect(file);
            e.target.value = "";
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </FormControl>

      <div className="flex flex-col items-center justify-center gap-3">
        <div
          className={cn(
            "p-3 rounded-full transition-colors",
            isDragActive ? "bg-primary/20" : "bg-muted-foreground/10"
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
            {isDragActive ? "Drop your image here" : "Drag and drop your image"}
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
  );
}

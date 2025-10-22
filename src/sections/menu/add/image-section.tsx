"use client";

import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/card";
import { Button } from "@ui/button";
import { Trash2, Upload, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function ImageSection() {
  const { setValue, watch } = useFormContext(); // access form context
  const imageFile = watch("image"); // watch form field value
  const [isDragActive, setIsDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Create preview when file changes
  useEffect(() => {
    if (imageFile && imageFile instanceof File) {
      const objectUrl = URL.createObjectURL(imageFile);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    setPreviewUrl(null);
  }, [imageFile]);

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setValue("image", file, { shouldValidate: true });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) handleFileUpload(files[0]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) handleFileUpload(files[0]);
  };

  const handleRemoveImage = () => {
    setValue("image", null);
    setPreviewUrl(null);
  };

  return (
    <Card className="sticky top-16 h-fit">
      <CardHeader>
        <CardTitle className="text-lg">Item Image</CardTitle>
        <CardDescription>
          Upload a beautiful photo of your dish (optional)
        </CardDescription>
      </CardHeader>

      <CardContent>
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
                onClick={handleRemoveImage}
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
              <input
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

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
      </CardContent>
    </Card>
  );
}

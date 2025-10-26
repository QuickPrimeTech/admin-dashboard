"use client";
import { useState, DragEvent, useEffect } from "react";
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
import { useMenuItemForm } from "@/contexts/menu/edit-menu-item";
import { ImageSectionSkeleton } from "../skeletons/image-section-skeleton";
import { generateBlurDataURL } from "@/helpers/file-helpers";
import { removeKeys } from "@/helpers/object-helpers";

export function ImageSection() {
  const { status, data, setUnsavedChanges, setFormData, updateFormData } =
    useMenuItemForm();

  const form = useForm<ImageFormValues>({
    resolver: zodResolver(imageSchema),
    defaultValues: { image: undefined },
  });

  const { control, setValue } = form;

  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const [isDragActive, setIsDragActive] = useState(false);
  const [isServerImageRemoved, setIsServerImageRemoved] = useState(false); // ✅ new state

  //  Detect unsaved changes for image
  useEffect(() => {
    const hadServerImage = data?.image_url;
    // Case 1: Had server image → removing it counts as change
    // Case 2: No server image → adding & then removing returns to initial state (not a change)
    const hasChanged = hadServerImage
      ? isServerImageRemoved || !!previewUrl
      : !!previewUrl;
    //Syncing with the context to update the save changes button
    setUnsavedChanges((prev) => ({
      ...prev,
      image: hasChanged,
    }));
  }, [previewUrl, isServerImageRemoved, setUnsavedChanges, data?.image_url]);

  // Skeleton while loading
  if (status === "pending") {
    return <ImageSectionSkeleton />;
  }

  // File selection logic
  async function handleFileSelect(file: File) {
    if (file?.type.startsWith("image/")) {
      setValue("image", file, { shouldValidate: true });
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      //Syncing the info with the context so that the image can be uploaded
      updateFormData({
        image: file,
        lqip: await generateBlurDataURL(file),
      });
      setIsServerImageRemoved(false); // if uploading a new one after removing
      return () => URL.revokeObjectURL(url);
    }
  }

  function handleRemove() {
    setValue("image", undefined);
    setPreviewUrl(undefined);
    setIsServerImageRemoved(true); // ✅ mark server image as removed
    //Checking if there was a server image before that
    const hadServerImage = data?.image_url;
    if (hadServerImage) {
      updateFormData({ image: null, lqip: null });
      return;
    }
    //If it didn't have a server image, I'll just remove the image info from the context
    setFormData((prev) => removeKeys(prev, ["image", "lqip"]));
  }

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

  //This is the function that runs when the user decides to restore the server image
  function restoreServerImage() {
    setIsServerImageRemoved(false);
    setValue("image", undefined); // clear uploaded file value
    setPreviewUrl(undefined); // reset preview
    //Removing the image data from the context if the user has restored the serve image
    setFormData((prev) => removeKeys(prev, ["image", "lqip"]));
  }

  const hasExistingImage = !!data?.image_url && !isServerImageRemoved; // account for removal

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
                  {/* ✅ Existing image from server */}
                  {hasExistingImage && !previewUrl && (
                    <ServerImagePreview
                      imageUrl={data.image_url}
                      lqip={data.lqip}
                      onRemove={handleRemove}
                    />
                  )}

                  {/* ✅ New uploaded image */}
                  {previewUrl && (
                    <ImagePreview
                      previewUrl={previewUrl}
                      onRemove={handleRemove}
                    />
                  )}

                  {/* ✅ Dropzone when no image or removed */}
                  {!previewUrl && !hasExistingImage && (
                    <div className="relative">
                      <ImageDropzone
                        isDragActive={isDragActive}
                        onDrag={handleDrag}
                        onDrop={handleDrop}
                        onFileSelect={handleFileSelect}
                      />

                      {/* ✅ Restore button if image was removed but existed on server */}
                      {isServerImageRemoved && data?.image_url && (
                        <div className="absolute inset-x-0 -bottom-1/2 flex justify-center">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={restoreServerImage}
                          >
                            Restore Image
                          </Button>
                        </div>
                      )}
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
/* -------------------------------------------- */
/* Subcomponents                                */
/* -------------------------------------------- */

// ✅ Show uploaded image preview
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
        className="object-cover rounded-lg"
      />
      <Button
        type="button"
        variant="destructive"
        size="sm"
        className="absolute top-2 right-2"
        onClick={onRemove}
      >
        <Trash2 />
        Remove
      </Button>
    </>
  );
}

// ✅ Show existing image from database with LQIP
function ServerImagePreview({
  imageUrl,
  lqip,
  onRemove,
}: {
  imageUrl: string;
  lqip?: string;
  onRemove: () => void;
}) {
  return (
    <>
      <Image
        src={imageUrl}
        alt="Item Image"
        fill
        className="object-cover rounded-lg"
        placeholder={lqip ? "blur" : "empty"}
        blurDataURL={lqip || undefined}
      />
      <Button
        type="button"
        variant="destructive"
        size="sm"
        className="absolute top-2 right-2"
        onClick={onRemove}
      >
        <Trash2 />
        Remove
      </Button>
    </>
  );
}

// ✅ Dropzone
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

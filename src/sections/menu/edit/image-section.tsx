"use client";
import { useState, DragEvent } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Upload, ImageIcon, Trash2, Save } from "lucide-react";

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
import axios from "axios";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

/* -------------------------------------------------
 *  Types
 * ------------------------------------------------*/
type ImageData = { image: File | null; lqip: string | null };

/* -------------------------------------------------
 *  Main component
 * ------------------------------------------------*/
export function ImageSection() {
  const { status, data } = useMenuItemForm();

  const form = useForm<ImageFormValues>({
    resolver: zodResolver(imageSchema),
    defaultValues: { image: undefined },
  });

  const { control, setValue } = form;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isServerImageRemoved, setIsServerImageRemoved] = useState(false);

  if (status === "pending") return <ImageSectionSkeleton />;

  /* ------------  file handling  ------------ */
  async function handleFileSelect(file: File) {
    if (!file.type.startsWith("image/")) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setValue("image", file, { shouldValidate: true });
    setImageData({ image: file, lqip: await generateBlurDataURL(file) });
    setIsServerImageRemoved(false);
    return () => URL.revokeObjectURL(url);
  }

  function handleRemove() {
    setValue("image", undefined);
    setPreviewUrl(undefined);
    setIsServerImageRemoved(true);
    setImageData(data?.image_url ? { image: null, lqip: null } : null);
  }

  /* ------------  drag & drop  ------------ */
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

  /* ------------  server restore  ------------ */
  function restoreServerImage() {
    setIsServerImageRemoved(false);
    setValue("image", undefined);
    setPreviewUrl(undefined);
    setImageData(null);
  }

  /* ------------  submit  ------------ */
  async function submitImage() {
    if (!imageData || !Object.keys(imageData).length) return;

    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("image", imageData.image ?? "");
      fd.append("lqip", imageData.lqip ?? "");
      fd.append("id", data?.id!);
      const { data: res } = await axios.patch("/api/menu-items", fd);
      toast.success(res.message);
    } catch {
      toast.error("There was an error submitting your image");
    } finally {
      setIsSubmitting(false);
    }
  }

  /* ------------  render  ------------ */
  const hasExistingImage = !!data?.image_url && !isServerImageRemoved;

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
                <div
                  className={cn(
                    "relative aspect-square",
                    !hasExistingImage && !previewUrl && "aspect-auto h-fit"
                  )}
                >
                  {hasExistingImage ? (
                    <ImageDisplay
                      src={data.image_url!}
                      placeholder={data.lqip}
                      alt="Item image"
                      onRemove={handleRemove}
                    />
                  ) : previewUrl ? (
                    <ImageDisplay
                      src={previewUrl}
                      alt="Preview"
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

                {/* restore button – only when server image was removed */}
                {isServerImageRemoved && data?.image_url && (
                  <div className="mt-2 flex justify-center">
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

                {/* save button – only when new image is staged */}
                {imageData && (
                  <Button
                    className="mt-3 w-full"
                    onClick={submitImage}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner /> Saving
                      </>
                    ) : (
                      <>
                        <Save /> Save Change
                      </>
                    )}
                  </Button>
                )}

                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </Form>
  );
}

/* -------------------------------------------------
 *  Re-usable pieces
 * ------------------------------------------------*/
type ImageDisplayProps = {
  src: string;
  alt: string;
  placeholder?: string;
  onRemove: () => void;
};

function ImageDisplay({ src, alt, placeholder, onRemove }: ImageDisplayProps) {
  return (
    <>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover rounded-lg"
        placeholder={placeholder ? "blur" : "empty"}
        blurDataURL={placeholder || undefined}
      />
      <Button
        type="button"
        variant="destructive"
        size="sm"
        className="absolute top-2 right-2"
        aria-label="delete image"
        onClick={onRemove}
      >
        <Trash2 /> Delete
      </Button>
    </>
  );
}

type DropzoneProps = {
  isDragActive: boolean;
  onDrag: (e: DragEvent) => void;
  onDrop: (e: DragEvent) => void;
  onFileSelect: (file: File) => void;
};

function ImageDropzone({
  isDragActive,
  onDrag,
  onDrop,
  onFileSelect,
}: DropzoneProps) {
  const dropCn = cn(
    "relative rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200",
    isDragActive
      ? "border-primary bg-primary/10"
      : "border-border bg-muted hover:bg-accent/50"
  );

  const iconCn = cn(
    "p-3 rounded-full transition-colors",
    isDragActive ? "bg-primary/20" : "bg-muted-foreground/10"
  );

  return (
    <div
      onDragEnter={onDrag}
      onDragLeave={onDrag}
      onDragOver={onDrag}
      onDrop={onDrop}
      className={dropCn}
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
        <div className={iconCn}>
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

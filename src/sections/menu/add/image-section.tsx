"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import ImageDropzone from "./image-dropzone";
import Image from "next/image";

interface ImageSectionProps {
  imagePreview: string;
  onImageUpload: (file: File) => void;
  onRemoveImage: () => void;
}

export default function ImageSection({
  imagePreview,
  onImageUpload,
  onRemoveImage,
}: ImageSectionProps) {
  return (
    <Card className="border-0 shadow-sm sticky top-6">
      <CardHeader>
        <CardTitle className="text-lg">Item Image</CardTitle>
        <CardDescription>
          Upload a beautiful photo of your dish (optional)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {imagePreview ? (
          <div className="relative aspect-5/4">
            <Image
              src={imagePreview || "/placeholder.svg"}
              alt="Preview"
              fill
              className="w-full h-64 object-cover rounded-lg"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={onRemoveImage}
            >
              <Trash2 />
              Remove
            </Button>
          </div>
        ) : (
          <ImageDropzone onImageUpload={onImageUpload} />
        )}
      </CardContent>
    </Card>
  );
}

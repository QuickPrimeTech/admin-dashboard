"use client";

import { type ChangeEventHandler, useState } from "react";
import Image from "next/image";
import { Edit2 } from "lucide-react";
import { Spinner } from "@ui/spinner";
import { cn } from "@/lib/utils";
import { useRestaurantQuery } from "@/hooks/use-restaurant";
import { generateGradient } from "@/components/navbar/user-dropdown";
import { getInitials } from "@/helpers/text-formatters";
import { useAvatarUrl, useUploadAvatar } from "@/hooks/use-avatar-url";
import { useMemo } from "react";
import { AvatarCropDialog } from "@/components/avatar/avatar-crop-dialog";

type Props = {
  size: number;
};

export default function Avatar({
  size,
  className,
}: Props & React.ComponentProps<"label">) {
  const { data: restaurant } = useRestaurantQuery();
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Fetch avatar URL
  const { data: avatarUrl } = useAvatarUrl(restaurant?.avatar_url);

  // Upload mutation
  const uploadMutation = useUploadAvatar(restaurant?.id, size);

  // Gradient fallback in case the image doesn't exist
  const gradient = useMemo(
    () => generateGradient(restaurant?.name || ""),
    [restaurant]
  );

  const handleFileSelect: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Store the file for later
    setSelectedFile(file);

    // Create a preview URL for cropping
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setCropDialogOpen(true);
    };
    reader.readAsDataURL(file);

    // Reset input so same file can be selected again
    e.target.value = "";
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    if (!selectedFile) return;

    // Convert blob to file with original filename
    const croppedFile = new File([croppedBlob], selectedFile.name, {
      type: selectedFile.type,
    });

    uploadMutation.mutate({
      file: croppedFile,
      oldAvatarPath: restaurant?.avatar_url,
    });

    // Clean up
    setSelectedImage(null);
    setSelectedFile(null);
  };

  /* ---------- render ---------- */
  return (
    <>
      <label
        htmlFor="avatar-upload"
        className={cn(
          "relative inline-block rounded-full overflow-hidden cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500",
          className
        )}
        style={{ width: size, height: size }}
        title={"Edit profile image"}
      >
        {/* preview image or placeholder */}
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={`${restaurant?.name} Profile picture`}
            fill
            className="object-cover"
            placeholder={restaurant?.lqip ? "blur" : "empty"}
            blurDataURL={restaurant?.lqip ?? undefined}
          />
        ) : (
          <div
            className={`flex justify-center items-center text-xl font-bold w-full h-full bg-linear-to-br ${gradient}`}
          >
            {getInitials(restaurant?.name ?? "")}
          </div>
        )}

        {/* edit icon overlay */}
        <span
          className={`absolute inset-0 grid place-content-center
                       bg-background/40 text-foreground ${
                         !uploadMutation.isPending && "opacity-0"
                       }
     hover:opacity-100 focus-within:opacity-100
      transition-opacity`}
        >
          {uploadMutation.isPending ? (
            <Spinner size={size / 4} />
          ) : (
            <Edit2 size={size / 4} aria-hidden />
          )}
        </span>

        {/* hidden but keyboard-accessible file input */}
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          disabled={uploadMutation.isPending}
          onChange={handleFileSelect}
          className="sr-only"
        />
      </label>

      {/* Crop dialog */}
      {selectedImage && (
        <AvatarCropDialog
          open={cropDialogOpen}
          onOpenChange={setCropDialogOpen}
          imageSrc={selectedImage}
          onCropComplete={handleCropComplete}
        />
      )}
    </>
  );
}

"use client";

import { useEffect, useMemo, useState, type ChangeEventHandler } from "react";
import Image from "next/image";
import { Edit2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Spinner } from "@ui/spinner";
import { generateBlurDataURL, resizeImage } from "@/helpers/file-helpers";
import { cn } from "@/lib/utils";
import { useRestaurantQuery } from "@/hooks/use-restaurant";
import { generateGradient } from "@/components/navbar/user-dropdown";
import { getInitials } from "@/helpers/text-formatters";
import { toast } from "sonner";

type Props = {
  size: number;
};

export default function Avatar({
  size,
  className,
}: Props & React.ComponentProps<"label">) {
  const supabase = createClient();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Get restaurant name
  const { data: restaurant } = useRestaurantQuery();

  //Gradient fallback incase the image doesn't exist
  const gradient = useMemo(
    () => generateGradient(restaurant?.name || ""),
    [restaurant]
  );

  // load existing avatar if present
  useEffect(() => {
    const setAvatar = async () => {
      if (!restaurant?.avatar_url) return;
      /** ------------- Create a signed url that will last for 4 hours ---------------**/
      const { data: avatarData } = await supabase.storage
        .from("avatars")
        .createSignedUrl(restaurant.avatar_url, 60 * 60 * 4);

      setAvatarUrl(avatarData?.signedUrl ?? null);
    };
    setAvatar();
  }, [restaurant]);

  const uploadAvatar: ChangeEventHandler<HTMLInputElement> = async (e) => {
    try {
      setUploading(true);

      const file = e.target.files?.[0];
      if (!file) return;

      // shrink the image BEFORE upload
      const resizedBlob = await resizeImage(file, size * 2);

      /* -------------------------------------------------------------
         1. DELETE OLD FILE IF EXISTS
      ------------------------------------------------------------- */
      if (restaurant?.avatar_url) {
        await supabase.storage.from("avatars").remove([restaurant.avatar_url]);
      }

      /* -------------------------------------------------------------
         2. UPLOAD NEW FILE
      ------------------------------------------------------------- */

      const ext = file.name.split(".").pop();
      const path = `avatar-${Date.now()}.${ext}`;

      const { error } = await supabase.storage
        .from("avatars")
        .upload(path, resizedBlob);

      if (error) throw error;

      /* -------------------------------------------------------------
         3. GENERATE THE LQIP TO SEND TO THE DB
      ------------------------------------------------------------- */

      // Convert blob → file (so LQIP function accepts it)
      const resizedFile = new File([resizedBlob], file.name, {
        type: file.type,
      });

      const lqip = await generateBlurDataURL(resizedFile);

      /* -------------------------------------------------------------
         4. UPDATE RESTAURANT.avatar_url
      ------------------------------------------------------------- */
      const { error: updateError } = await supabase
        .from("restaurants")
        .update({ avatar_url: path, lqip })
        .eq("id", restaurant.id);

      if (updateError) throw updateError;

      // preview resized version
      setAvatarUrl(URL.createObjectURL(resizedBlob));

      //Send toast message
      toast.success("Profile photo updated successfully", {
        description: "Your profile has been updated successfully",
      });
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* ---------- render ---------- */
  return (
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
          alt={`${restaurant.name} Profile picture`}
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
                         !uploading && "opacity-0"
                       }
     hover:opacity-100 focus-within:opacity-100
      transition-opacity`}
      >
        {uploading ? (
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
        disabled={uploading}
        onChange={uploadAvatar}
        className="sr-only"
      />
    </label>
  );
}

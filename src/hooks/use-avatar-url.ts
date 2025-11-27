import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { generateBlurDataURL, resizeImage } from "@/helpers/file-helpers";
import { toast } from "sonner";

export function useAvatarUrl(avatarPath: string | null | undefined) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["avatar-url", avatarPath],
    queryFn: async () => {
      if (!avatarPath) return null;

      const { data } = await supabase.storage
        .from("avatars")
        .createSignedUrl(avatarPath, 60 * 60 * 4);

      return data?.signedUrl ?? null;
    },
    enabled: !!avatarPath,
    staleTime: 60 * 60 * 3 * 1000, // 3 hours (refresh before it expires)
  });
}

export function useUploadAvatar(
  restaurantId: string | undefined,
  size: number
) {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      file,
      oldAvatarPath,
    }: {
      file: File;
      oldAvatarPath: string | null | undefined;
    }) => {
      // Resize image
      const resizedBlob = await resizeImage(file, size * 2);

      // Delete old file if exists
      if (oldAvatarPath) {
        await supabase.storage.from("avatars").remove([oldAvatarPath]);
      }

      // Upload new file
      const ext = file.name.split(".").pop();
      const path = `avatar-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, resizedBlob);

      if (uploadError) throw uploadError;

      // Generate LQIP
      const resizedFile = new File([resizedBlob], file.name, {
        type: file.type,
      });
      const lqip = await generateBlurDataURL(resizedFile);

      // Update restaurant record
      const { error: updateError } = await supabase
        .from("restaurants")
        .update({ avatar_url: path, lqip })
        .eq("id", restaurantId);

      if (updateError) throw updateError;

      return {
        path,
        lqip,
        previewUrl: URL.createObjectURL(resizedBlob),
      };
    },
    onSuccess: (data) => {
      // Invalidate restaurant query to refetch with new avatar
      queryClient.invalidateQueries({ queryKey: ["restaurant"] });

      // Optimistically update the avatar URL query
      queryClient.setQueryData(["avatar-url", data.path], data.previewUrl);

      toast.success("Profile photo updated successfully", {
        description: "Your profile has been updated successfully",
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Upload failed");
    },
  });
}

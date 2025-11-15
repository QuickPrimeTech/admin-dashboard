'use client'
import { useEffect, useState, type ChangeEventHandler } from 'react'
import Image from 'next/image'
import { Edit2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { Spinner } from '@/components/ui/spinner'
import { resizeImage } from '@/helpers/file-helpers'
import { User } from '@supabase/supabase-js'
import { cn } from '@/lib/utils'

type Props = {
  size: number
}

export default function Avatar({size, className}: Props & React.ComponentProps<"label">) {
  const supabase = createClient()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState<User|null>(null);

  /* ---------- fetch current user ---------- */
  useEffect(() => {
    async function fetchUser() {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }
    fetchUser()
  }, [supabase])

  const uploadAvatar: ChangeEventHandler<HTMLInputElement> = async (e) => {
  try {
    setUploading(true);

    const file = e.target.files?.[0];
    if (!file) return;

    // shrink the image BEFORE upload
    const resizedBlob = await resizeImage(file, size * 2);

    const ext = file.name.split('.').pop()
    const path = `${user?.id}-${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(path, resizedBlob);


    if (error) throw error;


    // preview resized version
    setAvatarUrl(URL.createObjectURL(resizedBlob));
    const {data: avatarData} = await supabase.storage
  .from('avatars').createSignedUrl(path, 60*60*4);


console.log("signed URL:", avatarData?.signedUrl);

  } catch (err) {
    console.error(err);
    alert("Upload failed");
  } finally {
    setUploading(false);
  }
};

  /* ---------- render ---------- */
  return (
    <label
      htmlFor="avatar-upload"
      className={cn("relative inline-block rounded-full overflow-hidden cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500", className)}
      style={{ width: size, height: size }}
      title={"Edit profile image"}
    >
      {/* preview image or placeholder */}
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt="Profile picture"
          fill
          className="object-cover"
        />
      ) : (
        <div
          className="w-full h-full bg-linear-to-br from-blue-400 to-purple-500"
        />
      )}

      {/* edit icon overlay */}
      <span className={`absolute inset-0 grid place-content-center
                       bg-background/40 text-foreground ${!uploading && "opacity-0"}
                       hover:opacity-100 focus-within:opacity-100
                       transition-opacity`}>
                      {uploading ? (
                        <Spinner  size={size/4} />
                      ): (

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
  )
}
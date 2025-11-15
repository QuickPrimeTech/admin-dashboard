'use client'

import { useState, type ChangeEventHandler } from 'react'
import Image from 'next/image'
import { Edit2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

type Props = {
  uid: string | null
  url: string | null
  size: number
  onUpload: (filePath: string) => void
}

export default function Avatar({ uid, url, size, onUpload }: Props) {
  const supabase = createClient()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(url)
  const [uploading, setUploading] = useState(false)

  /* ---------- download on mount ---------- */
  useState(() => {
    if (!url) return
    supabase.storage
      .from('avatars')
      .download(url)
      .then(({ data, error }) => {
        if (error) throw error
        setAvatarUrl(URL.createObjectURL(data))
      })
      .catch(console.error)
  })

  /* ---------- upload handler ---------- */
  const uploadAvatar: ChangeEventHandler<HTMLInputElement> = async (e) => {
    try {
      setUploading(true)
      const file = e.target.files?.[0]
      if (!file) return

      const ext = file.name.split('.').pop()
      const path = `${uid}-${Math.random()}.${ext}`

      const { error } = await supabase.storage.from('avatars').upload(path, file)
      if (error) throw error

      onUpload(path)          // save path to profiles table
      setAvatarUrl(URL.createObjectURL(file)) // instant preview
    } catch {
      alert('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  /* ---------- render ---------- */
  return (
    <label
      htmlFor="avatar-upload"
      className="relative inline-block rounded-full overflow-hidden cursor-pointer
                 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
      style={{ width: size, height: size }}
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
      <span className="absolute inset-0 grid place-content-center
                       bg-black/40 text-white opacity-0
                       hover:opacity-100 focus-within:opacity-100
                       transition-opacity">
        <Edit2 size={size / 4} aria-hidden />
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
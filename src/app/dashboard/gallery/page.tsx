import { GalleryPageContent } from "@/sections/gallery/gallery-page-content";
import { Metadata } from "next";

export const metadata:Metadata = {
  title: "Gallery",
description: "Upload and manage your restaurant’s photos in one place."

}

export default function GalleryPage() {
 return (
  <GalleryPageContent />
 )
}


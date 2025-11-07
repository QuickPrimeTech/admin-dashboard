import { toast } from "sonner";
import { FormData as FormDataProps } from "@/schemas/galllery-item-schema";

type Payload = {
  id: number;
};

export async function addGalleryImage(
  data: FormDataProps,
  setUploading: (value: boolean) => void,
  selectedFile: File | null,
  onSaved: () => void
) {
  if (!selectedFile) {
    toast.error("Please select an image.");
    return;
  }

  try {
    const formData = new FormData();

    // Add all form fields to payload
    formData.append("title", data.title || "");
    formData.append("description", data.description || "");
    formData.append("is_published", String(data.is_published));
    formData.append("category", data.category || "");
    formData.append("file", selectedFile);

    const res = await fetch("/api/gallery", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error(errorData);
      toast.error(errorData.error || "Failed to upload");
      setUploading(false);
      return;
    }

    const savedItem = await res.json();
    setUploading(false);
    toast.success(savedItem.message);
    onSaved();
  } catch {
    setUploading(false);
    toast.error("Something went wrong");
  }
}

export async function updateGalleryItem(
  data: FormDataProps & Payload,
  selectedFile: File | null
) {
  try {
    const formData = new FormData();

    // Add all form fields to payload
    formData.append("id", String(data.id));
    formData.append("title", data.title || "");
    formData.append("description", data.description || "");
    formData.append("is_published", String(data.is_published));
    formData.append("category", data.category || "");

    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    const response = await fetch("/api/gallery", {
      method: "PATCH",
      body: formData,
    });

    const res = await response.json();

    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error("Gallery item wasn’t successfully updated");
    }
  } catch {
    toast.error("Something went wrong");
  }
}

export async function deleteGalleryItem(id: number) {
  try {
    const res = await fetch(`/api/gallery?id=${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    if (!res.ok) {
      toast.error(data.message || "Could not delete item");
      return;
    }

    toast.success(data.message);
  } catch {
    toast.error("There was an error while deleting the gallery item");
  }
}

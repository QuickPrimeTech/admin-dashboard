import { FormData as FormDataProps } from "@/schemas/galllery-item-schema";
import { generateBlurDataURL } from "./file-helpers";

export function buildGalleryFormData(
  data: FormDataProps & { id?: number },
  selectedFile?: File | null,
  includeLqip = true
): Promise<FormData> | FormData {
  const formData = new FormData();
  if (data.id) formData.append("id", String(data.id));
  formData.append("title", data.title ?? "");
  formData.append("description", data.description ?? "");
  formData.append("is_published", String(data.is_published));
  formData.append("category", data.category ?? "");
  if (selectedFile) formData.append("file", selectedFile);

  // Optionally include LQIP (only for new uploads)
  if (includeLqip && selectedFile) {
    return generateBlurDataURL(selectedFile).then((lqip) => {
      formData.append("lqip", lqip);
      return formData;
    });
  }

  return formData;
}

type CleanedFormDataValue =
  | string
  | string[]
  | {
      name: string;
      size: number;
      type: string;
    }[]
  | undefined;

type CleanedFormData = Record<string, CleanedFormDataValue>;

/**
 * Converts FormData into a plain object with:
 * - Arrays for repeated fields
 * - File metadata instead of raw File objects
 */
export function cleanFormData(formData: FormData): CleanedFormData {
  const data: CleanedFormData = {};

  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      if (!data[key]) {
        data[key] = [];
      }
      (data[key] as { name: string; size: number; type: string }[]).push({
        name: value.name,
        size: value.size,
        type: value.type,
      });
    } else {
      if (data[key]) {
        if (Array.isArray(data[key])) {
          (data[key] as string[]).push(value);
        } else {
          data[key] = [data[key] as string, value];
        }
      } else {
        data[key] = value;
      }
    }
  }

  return data;
}

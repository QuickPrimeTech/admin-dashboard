/**
 * Converts FormData into a plain object with:
 * - Arrays for repeated fields
 * - File metadata instead of raw File objects
 */
export function cleanFormData(formData: FormData) {
  const data: Record<string, any> = {};

  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      if (!data[key]) {
        data[key] = [];
      }
      data[key].push({
        name: value.name,
        size: value.size,
        type: value.type,
      });
    } else {
      if (data[key]) {
        if (Array.isArray(data[key])) {
          data[key].push(value);
        } else {
          data[key] = [data[key], value];
        }
      } else {
        data[key] = value;
      }
    }
  }

  return data;
}

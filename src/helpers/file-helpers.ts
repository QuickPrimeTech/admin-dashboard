/**
 * Converts a File object to a Base64 data URL string.
 * Example output: "data:image/png;base64,iVBORw0K..."
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Converts a Base64 data URL string back into a File object.
 * Example usage: base64ToFile("data:image/png;base64,...", "image.png")
 */
export function base64ToFile(base64String: string, filename: string): File {
  const [header, data] = base64String.split(",");
  const mime = header.match(/:(.*?);/)?.[1] || "application/octet-stream";
  const binary = atob(data);
  const len = binary.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new File([bytes], filename, { type: mime });
}

export async function generateBlurDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        // create a canvas
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) return reject("Canvas context not available");

        // scale down image
        const width = 16; // desired small width
        const scale = width / img.width;
        const height = img.height * scale;

        canvas.width = width;
        canvas.height = height;

        // apply blur and draw
        context.filter = "blur(8px)";
        context.drawImage(img, 0, 0, width, height);

        const base64 = canvas.toDataURL("image/jpeg", 0.5);
        resolve(base64);
      };
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ---------- resize image before upload ---------- */
export async function resizeImage(file: File, maxSize: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) return reject("Canvas error");

      let { width, height } = img;

      // maintain aspect ratio
      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);

      // convert canvas to blob
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject("Blob conversion failed");
          resolve(blob);
        },
        "image/jpeg",
        1 // compression quality
      );
    };

    img.onerror = reject;
  });
}

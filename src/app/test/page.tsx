"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function ImageUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);

    setIsLoading(true);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log(data);
    setUploadResult(data);
    setIsLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="file"
          name="image"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            setSelectedFile(file || null);
          }}
        />
        <Button
          type="submit"
          disabled={!selectedFile || isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" />
              Uploading Image
            </>
          ) : (
            "Upload Image"
          )}
        </Button>
      </form>

      {uploadResult && (
        <div className="p-2 border rounded text-sm">
          {uploadResult.error && (
            <p className="text-red-500">Error: {uploadResult.error}</p>
          )}
          {uploadResult.data && (
            <>
              <p>Uploaded!</p>
              <img
                src={uploadResult.data.secure_url}
                alt="Uploaded"
                className="mt-2 rounded"
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import { Input } from "@/components/ui/input";
import { UploadCloud } from "lucide-react";

const LogoUpload = ({ qrOptions, setQrOptions }: any) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setQrOptions((prev: any) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Upload Logo</label>
      <div className="flex items-center gap-2">
        <UploadCloud className="h-5 w-5" />
        <Input type="file" accept="image/*" onChange={handleChange} />
      </div>
    </div>
  );
};

export default LogoUpload;

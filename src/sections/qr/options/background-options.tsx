"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BackgroundOptions = ({ qrOptions, setQrOptions }: any) => {
  return (
    <div className="space-y-2">
      <Label>Background Color</Label>
      <Input
        type="color"
        value={qrOptions.backgroundOptions.color}
        onChange={(e) =>
          setQrOptions((prev: any) => ({
            ...prev,
            backgroundOptions: {
              ...prev.backgroundOptions,
              color: e.target.value,
            },
          }))
        }
      />
    </div>
  );
};

export default BackgroundOptions;

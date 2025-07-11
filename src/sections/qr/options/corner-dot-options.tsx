"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CornerDotOptions = ({ qrOptions, setQrOptions }: any) => {
  return (
    <div className="space-y-2">
      <Label>Corner Dot Color</Label>
      <Input
        type="color"
        value={qrOptions.cornersDotOptions.color}
        onChange={(e) =>
          setQrOptions((prev: any) => ({
            ...prev,
            cornersDotOptions: {
              ...prev.cornersDotOptions,
              color: e.target.value,
            },
          }))
        }
      />
    </div>
  );
};

export default CornerDotOptions;

"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DotOptions = ({ qrOptions, setQrOptions }: any) => {
  return (
    <div className="space-y-2">
      <Label>Dot Color</Label>
      <Input
        type="color"
        value={qrOptions.dotsOptions.color}
        onChange={(e) =>
          setQrOptions((prev: any) => ({
            ...prev,
            dotsOptions: { ...prev.dotsOptions, color: e.target.value },
          }))
        }
      />
    </div>
  );
};

export default DotOptions;

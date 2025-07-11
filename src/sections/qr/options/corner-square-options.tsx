"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CornerSquareOptions = ({ qrOptions, setQrOptions }: any) => {
  return (
    <div className="space-y-2">
      <Label>Corner Square Color</Label>
      <Input
        type="color"
        value={qrOptions.cornersSquareOptions.color}
        onChange={(e) =>
          setQrOptions((prev: any) => ({
            ...prev,
            cornersSquareOptions: {
              ...prev.cornersSquareOptions,
              color: e.target.value,
            },
          }))
        }
      />
    </div>
  );
};

export default CornerSquareOptions;

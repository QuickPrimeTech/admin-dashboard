"use client";

import { Card, CardContent } from "@/components/ui/card";

const QrPreview = () => {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Live Preview</h2>
        <div id="qr-preview" className="w-[300px] h-[300px] mx-auto" />
      </CardContent>
    </Card>
  );
};

export default QrPreview;

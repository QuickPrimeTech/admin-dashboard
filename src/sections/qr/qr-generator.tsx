"use client";

import { useState, useRef, useEffect } from "react";
import QRCodeStyling from "qr-code-styling";
import { Card, CardContent } from "@/components/ui/card";
import QrOptionsTabs from "./qr-options-tabs";
import QrPreview from "./qr-preview";

const QrGenerator = () => {
  const [qrOptions, setQrOptions] = useState({
    width: 300,
    height: 300,
    data: "https://example.com",
    image: "",
    dotsOptions: {
      color: "#000000",
      type: "rounded",
    },
    cornersSquareOptions: {
      type: "extra-rounded",
      color: "#000000",
    },
    cornersDotOptions: {
      type: "dot",
      color: "#000000",
    },
    backgroundOptions: {
      color: "#ffffff",
    },
  });

  const qrRef = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    if (!qrRef.current) {
      qrRef.current = new QRCodeStyling(qrOptions);
      qrRef.current.append(document.getElementById("qr-preview")!);
    } else {
      qrRef.current.update(qrOptions);
    }
  }, [qrOptions]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Customize Your QR Code</h2>
          <QrOptionsTabs qrOptions={qrOptions} setQrOptions={setQrOptions} />
        </CardContent>
      </Card>

      <QrPreview />
    </div>
  );
};

export default QrGenerator;

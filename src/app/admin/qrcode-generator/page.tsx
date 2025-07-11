"use client";

import { useEffect, useRef, useState, ChangeEvent } from "react";
import QRCodeStyling, { Options, FileExtension } from "qr-code-styling";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DownloadIcon, Upload } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function ClientQR() {
  const [options, setOptions] = useState<Options>({
    width: 300,
    height: 300,
    type: "svg",
    data: "https://yourrestaurant.com",
    image:
      "https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png",
    margin: 10,
    qrOptions: {
      typeNumber: 0,
      mode: "Byte",
      errorCorrectionLevel: "Q",
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.4,
      margin: 20,
      crossOrigin: "anonymous",
      saveAsBlob: true,
    },
    dotsOptions: {
      color: "#222222",
      type: "rounded",
      gradient: undefined,
    },
    cornersSquareOptions: {
      type: "dot",
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

  const [fileExt, setFileExt] = useState<FileExtension>("svg");
  const [qrCode, setQrCode] = useState<QRCodeStyling>();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQrCode(new QRCodeStyling(options));
  }, []);

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = "";
      qrCode?.append(ref.current);
    }
  }, [qrCode, ref]);

  useEffect(() => {
    if (!qrCode) return;
    qrCode.update(options);
  }, [qrCode, options]);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setOptions((prev) => ({
          ...prev,
          image: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const updateNestedOption = (
    section: keyof Options,
    key: string,
    value: any
  ) => {
    setOptions((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [key]: value,
      },
    }));
  };

  const handleGradientToggle = (
    section:
      | "dotsOptions"
      | "cornersSquareOptions"
      | "cornersDotOptions"
      | "backgroundOptions",
    mode: "single" | "gradient"
  ) => {
    if (mode === "single") {
      updateNestedOption(section, "gradient", undefined);
    } else {
      updateNestedOption(section, "gradient", {
        type: "linear",
        rotation: 0,
        colorStops: [
          { offset: 0, color: "#000000" },
          { offset: 1, color: "#ffffff" },
        ],
      });
    }
  };

  const updateGradientColor = (
    section:
      | "dotsOptions"
      | "cornersSquareOptions"
      | "cornersDotOptions"
      | "backgroundOptions",
    index: number,
    color: string
  ) => {
    setOptions((prev) => {
      const gradient = {
        ...(prev[section]?.gradient || {
          type: "linear",
          rotation: 0,
          colorStops: [
            { offset: 0, color: "#000000" },
            { offset: 1, color: "#ffffff" },
          ],
        }),
      };
      gradient.colorStops[index].color = color;
      return {
        ...prev,
        [section]: {
          ...(prev[section] || {}),
          gradient,
        },
      };
    });
  };

  const updateGradientRotation = (
    section:
      | "dotsOptions"
      | "cornersSquareOptions"
      | "cornersDotOptions"
      | "backgroundOptions",
    rotation: number
  ) => {
    setOptions((prev) => {
      const gradient = {
        ...(prev[section]?.gradient || {
          type: "linear",
          rotation: 0,
          colorStops: [
            { offset: 0, color: "#000000" },
            { offset: 1, color: "#ffffff" },
          ],
        }),
      };
      gradient.rotation = rotation;
      return {
        ...prev,
        [section]: {
          ...(prev[section] || {}),
          gradient,
        },
      };
    });
  };

  const onDownloadClick = () => {
    if (!qrCode) return;
    qrCode.download({ extension: fileExt });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mt-10">
      <CardHeader>
        <CardTitle className="text-lg">Custom QR Code Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center border rounded-md p-4 bg-background">
          <div ref={ref} />
        </div>

        <Tabs defaultValue="content" className="w-full">
          <ScrollArea className="w-full whitespace-nowrap">
            <TabsList className="flex w-max space-x-2 rounded-lg border p-3 h-fit">
              <TabsTrigger value="content" className="flex-shrink-0">
                Content
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex-shrink-0">
                Background
              </TabsTrigger>
              <TabsTrigger value="image" className="flex-shrink-0">
                Image
              </TabsTrigger>
              <TabsTrigger value="dots" className="flex-shrink-0">
                Dots
              </TabsTrigger>
              <TabsTrigger value="cornersSquare" className="flex-shrink-0">
                Corners Square
              </TabsTrigger>
              <TabsTrigger value="cornersDot" className="flex-shrink-0">
                Corners Dot
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {/* === CONTENT TAB === */}
          <TabsContent value="content">
            <div className="grid gap-4 mt-4">
              <Label>QR Data</Label>
              <Input
                value={options.data}
                onChange={(e) =>
                  setOptions({ ...options, data: e.target.value })
                }
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Width</Label>
                  <Input
                    type="number"
                    value={options.width}
                    onChange={(e) =>
                      setOptions({ ...options, width: +e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Height</Label>
                  <Input
                    type="number"
                    value={options.height}
                    onChange={(e) =>
                      setOptions({ ...options, height: +e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* === BACKGROUND TAB === */}
          <TabsContent value="appearance">
            <div className="grid gap-4 mt-4">
              <Label>Mode</Label>
              <Select
                value={
                  options.backgroundOptions?.gradient ? "gradient" : "single"
                }
                onValueChange={(value) =>
                  handleGradientToggle("backgroundOptions", value as any)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select color mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="gradient">Gradient</SelectItem>
                </SelectContent>
              </Select>

              {!options.backgroundOptions?.gradient ? (
                <div>
                  <Label>Background Color</Label>
                  <Input
                    type="color"
                    value={options.backgroundOptions?.color || "#ffffff"}
                    onChange={(e) =>
                      updateNestedOption(
                        "backgroundOptions",
                        "color",
                        e.target.value
                      )
                    }
                  />
                </div>
              ) : (
                <>
                  <Label>Gradient Colors</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="color"
                      value={
                        options.backgroundOptions?.gradient?.colorStops?.[0]
                          ?.color || "#000000"
                      }
                      onChange={(e) =>
                        updateGradientColor(
                          "backgroundOptions",
                          0,
                          e.target.value
                        )
                      }
                    />
                    <Input
                      type="color"
                      value={
                        options.backgroundOptions?.gradient?.colorStops?.[1]
                          ?.color || "#ffffff"
                      }
                      onChange={(e) =>
                        updateGradientColor(
                          "backgroundOptions",
                          1,
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <Label>Rotation</Label>
                  <Input
                    type="number"
                    value={options.backgroundOptions?.gradient?.rotation || 0}
                    onChange={(e) =>
                      updateGradientRotation(
                        "backgroundOptions",
                        +e.target.value
                      )
                    }
                  />
                </>
              )}
            </div>
          </TabsContent>

          {/* === IMAGE TAB === */}
          <TabsContent value="image">
            <div className="grid gap-4 mt-4">
              <Label>Upload Logo</Label>
              {/* Wrapper to style the input as a clickable dropzone */}
              <div className="relative h-16 flex  items-center justify-center rounded-md border border-dashed border-gray-300 bg-muted p-6 text-center text-sm text-muted-foreground hover:bg-muted/80 transition">
                <Upload className="mr-2 h-5 w-5" />
                <span>Click here to upload (PNG or SVG)</span>
                {/* Keep the actual input but hide it */}
                <Input
                  type="file"
                  accept="image/png,image/svg+xml"
                  onChange={handleImageUpload}
                  className="absolute h-full opacity-0 cursor-pointer"
                />
              </div>

              <Label>Image Size</Label>
              <Input
                type="number"
                step="0.1"
                value={options.imageOptions?.imageSize || 0.4}
                onChange={(e) =>
                  updateNestedOption(
                    "imageOptions",
                    "imageSize",
                    parseFloat(e.target.value)
                  )
                }
              />
            </div>
          </TabsContent>

          {/* === DOTS OPTIONS TAB === */}
          <TabsContent value="dots">
            <div className="grid gap-4 mt-4">
              <Label>Dot Style</Label>
              <Select
                value={options.dotsOptions?.type || "rounded"}
                onValueChange={(value) =>
                  updateNestedOption("dotsOptions", "type", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rounded">Rounded</SelectItem>
                  <SelectItem value="dots">Dots</SelectItem>
                  <SelectItem value="classy">Classy</SelectItem>
                  <SelectItem value="square">Square</SelectItem>
                  <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                </SelectContent>
              </Select>

              {/* Reuse gradient logic */}
              <Label>Color Mode</Label>
              <Select
                value={options.dotsOptions?.gradient ? "gradient" : "single"}
                onValueChange={(value) =>
                  handleGradientToggle("dotsOptions", value as any)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="gradient">Gradient</SelectItem>
                </SelectContent>
              </Select>

              {!options.dotsOptions?.gradient ? (
                <Input
                  type="color"
                  value={options.dotsOptions?.color || "#000000"}
                  onChange={(e) =>
                    updateNestedOption("dotsOptions", "color", e.target.value)
                  }
                />
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="color"
                      value={
                        options.dotsOptions?.gradient?.colorStops?.[0]?.color ||
                        "#000000"
                      }
                      onChange={(e) =>
                        updateGradientColor("dotsOptions", 0, e.target.value)
                      }
                    />
                    <Input
                      type="color"
                      value={
                        options.dotsOptions?.gradient?.colorStops?.[1]?.color ||
                        "#ffffff"
                      }
                      onChange={(e) =>
                        updateGradientColor("dotsOptions", 1, e.target.value)
                      }
                    />
                  </div>
                  <Label>Rotation</Label>
                  <Input
                    type="number"
                    value={options.dotsOptions?.gradient?.rotation || 0}
                    onChange={(e) =>
                      updateGradientRotation("dotsOptions", +e.target.value)
                    }
                  />
                </>
              )}
            </div>
          </TabsContent>

          {/* === CORNERS SQUARE OPTIONS TAB === */}
          <TabsContent value="cornersSquare">
            <div className="grid gap-4 mt-4">
              <Label>Style</Label>
              <Select
                value={options.cornersSquareOptions?.type || "dot"}
                onValueChange={(value) =>
                  updateNestedOption("cornersSquareOptions", "type", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dot">Dot</SelectItem>
                  <SelectItem value="square">Square</SelectItem>
                  <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                </SelectContent>
              </Select>
              <Label>Color</Label>
              <Input
                type="color"
                value={options.cornersSquareOptions?.color || "#000000"}
                onChange={(e) =>
                  updateNestedOption(
                    "cornersSquareOptions",
                    "color",
                    e.target.value
                  )
                }
              />
            </div>
          </TabsContent>

          {/* === CORNERS DOT OPTIONS TAB === */}
          <TabsContent value="cornersDot">
            <div className="grid gap-4 mt-4">
              <Label>Style</Label>
              <Select
                value={options.cornersDotOptions?.type || "dot"}
                onValueChange={(value) =>
                  updateNestedOption("cornersDotOptions", "type", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dot">Dot</SelectItem>
                  <SelectItem value="square">Square</SelectItem>
                  <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                </SelectContent>
              </Select>
              <Label>Color</Label>
              <Input
                type="color"
                value={options.cornersDotOptions?.color || "#000000"}
                onChange={(e) =>
                  updateNestedOption(
                    "cornersDotOptions",
                    "color",
                    e.target.value
                  )
                }
              />
            </div>
          </TabsContent>
        </Tabs>
        {/* === DOWNLOAD SECTION === */}
        <div className="grid gap-4">
          <Label>Download Format</Label>
          <Select
            value={fileExt}
            onValueChange={(value) => setFileExt(value as FileExtension)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="svg">SVG</SelectItem>
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="jpeg">JPEG</SelectItem>
              <SelectItem value="webp">WEBP</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={onDownloadClick} className="w-full">
            <DownloadIcon className="mr-2 h-4 w-4" />
            Download QR Code
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

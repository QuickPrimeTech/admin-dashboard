"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import LogoUpload from "./options/logo-upload";
import DotOptions from "./options/dot-options";
import CornerSquareOptions from "./options/corner-square-options";
import CornerDotOptions from "./options/corner-dot-options";
import BackgroundOptions from "./options/background-options";

const QrOptionsTabs = ({ qrOptions, setQrOptions }: any) => {
  return (
    <Tabs defaultValue="logo" className="w-full">
      <TabsList className="grid grid-cols-5">
        <TabsTrigger value="logo">Logo</TabsTrigger>
        <TabsTrigger value="dots">Dots</TabsTrigger>
        <TabsTrigger value="cornerSquares">Corner Sq</TabsTrigger>
        <TabsTrigger value="cornerDots">Corner Dots</TabsTrigger>
        <TabsTrigger value="background">Background</TabsTrigger>
      </TabsList>

      <TabsContent value="logo">
        <LogoUpload qrOptions={qrOptions} setQrOptions={setQrOptions} />
      </TabsContent>
      <TabsContent value="dots">
        <DotOptions qrOptions={qrOptions} setQrOptions={setQrOptions} />
      </TabsContent>
      <TabsContent value="cornerSquares">
        <CornerSquareOptions
          qrOptions={qrOptions}
          setQrOptions={setQrOptions}
        />
      </TabsContent>
      <TabsContent value="cornerDots">
        <CornerDotOptions qrOptions={qrOptions} setQrOptions={setQrOptions} />
      </TabsContent>
      <TabsContent value="background">
        <BackgroundOptions qrOptions={qrOptions} setQrOptions={setQrOptions} />
      </TabsContent>
    </Tabs>
  );
};

export default QrOptionsTabs;

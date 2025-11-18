"use client";
import { useState } from "react";
import { Offer } from "@/types/offers";
import { OfferForm } from "./offer-form";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/tabs";

export function OffersPageContent() {
  const [previewOffer, setPreviewOffer] = useState<Partial<Offer>>({
    title: "",
    description: "",
  });
  const [mediaPreview, setMediaPreview] = useState<string>("");

  const handlePreviewUpdate = (offer: Partial<Offer>, media?: string) => {
    setPreviewOffer(offer);
    if (media) setMediaPreview(media);
  };

  return (
    <div className="max-w-7xl mx-auto py-8">
      <Tabs defaultValue="form" className="space-y-6">
        <TabsList className="sticky top-17 z-50">
          <TabsTrigger value="form">Form</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        {/* Form Tab */}
        <TabsContent value="form">
          <OfferForm onPreviewUpdate={handlePreviewUpdate} />
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Live Preview</CardTitle>
              <p className="text-xs text-neutral-500 mt-2">
                This is how your offer will appear to customers
              </p>
            </CardHeader>
            <CardContent>
              {/* <OfferPreview offer={previewOffer} mediaPreview={mediaPreview} /> */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

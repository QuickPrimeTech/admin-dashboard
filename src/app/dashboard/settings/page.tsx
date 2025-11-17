import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicInfoForm } from "@/sections/settings/basic-info";
import { ContactInfoForm } from "@/sections/settings/contact-info";
import { SocialMediaForm } from "@/sections/settings/social-media";
import { Info, Phone, Send } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Branch Settings",
  description:
    "Manage your branch information in one place and see them change instantly on your website",
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Branch Settings</h1>
        <p className="text-muted-foreground">
          Manage your restaurant settings and social media links
        </p>
      </div>
      <Tabs defaultValue="basic-info">
        <TabsList className="mb-4">
          <TabsTrigger value="basic-info">
            <Info /> Basic Information
          </TabsTrigger>
          <TabsTrigger value="contact-info">
            <Phone />
            Contact Info
          </TabsTrigger>
          <TabsTrigger value="socials">
            <Send />
            Social Media Links
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic-info">
          <BasicInfoForm />
        </TabsContent>

        <TabsContent value="contact-info">
          <ContactInfoForm />
        </TabsContent>
        <TabsContent value="socials">
          <SocialMediaForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}

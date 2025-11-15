import dynamic from "next/dynamic";
import { RestaurantForm } from "./restaurant-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccountForm } from "./account-form";
import { ImageIcon } from "lucide-react";

const Avatar = dynamic(() => import("./avatar"));

export async function ProfilePageContent() {
  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="flex justify-center items-center h-45  rounded-t-lg bg-linear-to-r from-orange-400 via-pink-500 to-purple-600">
          <h1 className="text-2xl md:text-2xl lg:text-4xl font-bold">
            Your account settings
          </h1>
        </div>
        <div className="absolute -bottom-12 left-6">
          <div className="relative border-4 border-background rounded-full aspect-square">
            <Avatar size={90} />
            <ImageIcon className="absolute size-4 right-2 bg-background bottom-2 text-foreground" />
          </div>
        </div>
      </div>

      <Tabs defaultValue="basic-info">
        <TabsList className="mt-10 bg-none">
          <TabsTrigger value="basic-info">Basic Information</TabsTrigger>
          <TabsTrigger value="account">Account Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="basic-info">
          <RestaurantForm />
        </TabsContent>

        <TabsContent value="account">
          <AccountForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}

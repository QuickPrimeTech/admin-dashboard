import dynamic from "next/dynamic";
import { RestaurantForm } from "./basic-info";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
        <Avatar
          size={90}
          className="absolute -bottom-12 left-6 border-4 border-background"
        />
      </div>

      <Tabs defaultValue="basic-info">
        <TabsList className="mt-10 bg-none">
          <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="basic-info">
          <RestaurantForm />
        </TabsContent>

        <TabsContent value="account">
          <RestaurantForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}

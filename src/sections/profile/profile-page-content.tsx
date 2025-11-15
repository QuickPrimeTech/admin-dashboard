import dynamic from 'next/dynamic';
import { BasicInfo } from "./basic-info";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createClient } from '@/utils/supabase/server';
const Avatar = dynamic(() => import('./avatar'));


export const title = "Edit Profile";

export async function ProfilePageContent() {
  const supabase = await createClient();



  return (
    <div className="space-y-6">
      <div className="relative">

        <div className="flex justify-center items-center h-40 rounded-t-lg bg-linear-to-r from-orange-400 via-pink-500 to-purple-600">
          <h1 className='text-4xl font-bold'>Your account settings</h1>
        </div>
<Avatar size={90} className="absolute -bottom-12 left-6 border-4 border-background"/>
      </div>

      <Tabs defaultValue="basic-info">
        <TabsList className="mt-10 bg-none">
          <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="basic-info">
          <BasicInfo />
        </TabsContent>

        <TabsContent value="account">
          <BasicInfo />
        </TabsContent>
      </Tabs>
    </div>
  );
}

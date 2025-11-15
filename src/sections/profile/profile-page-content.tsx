import dynamic from 'next/dynamic';
import { ImageIcon, XIcon } from "lucide-react";
import { BasicInfo } from "./basic-info";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createClient } from '@/utils/supabase/server';

const AccountForm = dynamic(() => import('./account-form'));

export const title = "Edit Profile";

export async function ProfilePageContent() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch the restaurant row where user_id = current user
  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="h-40 rounded-t-lg bg-linear-to-r from-orange-400 via-pink-500 to-purple-600">
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
            >
              <ImageIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Avatar */}
        <div className="absolute -bottom-12 left-6">
          <div className="relative">
            <div className="h-24 w-24 rounded-full border-4 border-background bg-linear-to-br from-blue-400 to-purple-500" />
            <button
              type="button"
              className="absolute right-0 bottom-0 flex h-8 w-8 items-center justify-center rounded-full bg-black text-white hover:bg-black/80"
            >
              <ImageIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
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
          <AccountForm user={user} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

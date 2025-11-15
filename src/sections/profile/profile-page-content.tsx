import dynamic from 'next/dynamic';
import { ImageIcon, XIcon } from "lucide-react";
import { BasicInfo } from "./basic-info";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Avatar = dynamic(() => import('./avatar'));

export const title = "Edit Profile";

export function ProfilePageContent() {

  return (
        <div className="space-y-6">
          <div className="relative">
            <div className="h-40 rounded-t-lg bg-linear-to-r from-orange-400 via-pink-500 to-purple-600">
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
                  type="button"
                >
                  <ImageIcon className="h-4 w-4" />
                </button>
                <button
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
                  type="button"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="-bottom-12 absolute left-6">
              <div className="relative">
                {/* <Avatar /> */}
                <div className="h-24 w-24 rounded-full border-4 border-background bg-linear-to-br from-blue-400 to-purple-500" />
                <button
                  className="absolute right-0 bottom-0 flex h-8 w-8 items-center justify-center rounded-full bg-black text-white transition-colors hover:bg-black/80"
                  type="button"
                >
                  <ImageIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          <Tabs defaultValue="basic-info">
<TabsList className="mt-10 bg-none">
          <TabsTrigger value="basic-info" className='bg-none'>Basic Info</TabsTrigger>
          <TabsTrigger value="account" className='bg-none'>Account</TabsTrigger>
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

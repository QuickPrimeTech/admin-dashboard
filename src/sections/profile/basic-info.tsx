"use client"

import { Textarea } from "@ui/textarea";
import { Input } from "@ui/input";
import { Label } from "@ui/label";
import { CheckIcon } from "lucide-react";
import { useState } from "react";

export function BasicInfo() {
      const [username, setUsername] = useState("margaret-villard-69");
  const [bio, setBio] = useState(
    "Hey, I am Margaret, a web developer who loves turning ideas into amazing websites!"
  );
  const maxBioLength = 200;
    return (
          <div className="space-y-4 px-6 pt-14">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input defaultValue="Margaret" id="firstName" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input defaultValue="Villard" id="lastName" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <Input
                  id="username"
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                />
                <CheckIcon className="-translate-y-1/2 absolute top-1/2 right-3 h-4 w-4 text-green-600" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <div className="flex">
                <div className="flex items-center rounded-l-md border border-input border-r-0 bg-muted px-3 text-muted-foreground text-sm">
                  https://
                </div>
                <Input
                  className="rounded-l-none"
                  defaultValue="www.margaret.com"
                  id="website"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Biography</Label>
              <Textarea
                className="min-h-[100px] resize-none"
                id="bio"
                maxLength={maxBioLength}
                onChange={(e) => setBio(e.target.value)}
                value={bio}
              />
              <p className="text-right text-muted-foreground text-xs">
                {maxBioLength - bio.length} characters left
              </p>
            </div>
          </div>
    )
}
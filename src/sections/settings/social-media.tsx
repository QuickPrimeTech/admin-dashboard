"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SocialMediaData, socialMediaSchema } from "@/schemas/branch-settings";
import { Card, CardHeader, CardTitle, CardContent } from "@ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@ui/form";
import { Button } from "@ui/button";
import { IoLogoTiktok } from "react-icons/io5";
import { FaXTwitter } from "react-icons/fa6";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Instagram, Facebook, Youtube, Save } from "lucide-react";

export function SocialMediaForm() {
  const form = useForm<SocialMediaData>({
    resolver: zodResolver(socialMediaSchema),
    defaultValues: {},
  });

  const onSubmit = (values: SocialMediaData) => {
    console.log("About to submit social media values as --------->", values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Media</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Instagram */}
            <FormField
              control={form.control}
              name="instagram_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupAddon>
                        <Instagram />
                      </InputGroupAddon>
                      <InputGroupInput
                        placeholder="https://instagram.com/yourpage"
                        {...field}
                      />
                    </InputGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Facebook */}
            <FormField
              control={form.control}
              name="facebook_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facebook</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupAddon>
                        <Facebook />
                      </InputGroupAddon>
                      <InputGroupInput
                        placeholder="https://facebook.com/yourpage"
                        {...field}
                      />
                    </InputGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* TikTok */}
            <FormField
              control={form.control}
              name="tiktok_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TikTok</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupAddon>
                        <IoLogoTiktok />
                      </InputGroupAddon>
                      <InputGroupInput
                        placeholder="https://tiktok.com/yourpage"
                        {...field}
                      />
                    </InputGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* YouTube */}
            <FormField
              control={form.control}
              name="youtube_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>YouTube</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupAddon>
                        <Youtube />
                      </InputGroupAddon>
                      <InputGroupInput
                        placeholder="https://youtube.com/yourpage"
                        {...field}
                      />
                    </InputGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* X (Twitter) */}
            <FormField
              control={form.control}
              name="x"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>X (formerly Twitter)</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupAddon>
                        <FaXTwitter />
                      </InputGroupAddon>
                      <InputGroupInput
                        placeholder="https://twitter.com/yourpage"
                        {...field}
                      />
                    </InputGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="col-span-1 md:col-span-2 flex justify-end pt-4">
              <Button type="submit" className="flex items-center gap-2">
                <Save />
                Save Social Links
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

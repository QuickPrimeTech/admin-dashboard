"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SocialMediaData, socialMediaSchema } from "@/schemas/branch-settings";
import { Card, CardHeader, CardTitle, CardContent } from "@ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@ui/form";
import { Button } from "@ui/button";
import { IoLogoTiktok } from "react-icons/io5";
import { FaXTwitter } from "react-icons/fa6";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@ui/input-group";
import { Instagram, Facebook, Youtube, Save } from "lucide-react";
import { toast } from "sonner";
import { useBranch } from "@/components/providers/branch-provider";
import { useGetCurrentBranch } from "@/hooks/use-branches";
import { useUpdateSettings } from "@/hooks/use-settings";
import { Spinner } from "@/components/ui/spinner";
import { useEffect } from "react";

export function SocialMediaForm() {
  const { branchId } = useBranch();
  const { data: branch } = useGetCurrentBranch(branchId);
  // Initialize mutation
  const updateSettings = useUpdateSettings(branchId);
  const isSubmitting = updateSettings.isPending;

  const form = useForm<SocialMediaData>({
    resolver: zodResolver(socialMediaSchema),
    defaultValues: {
      instagram_url: undefined,
      facebook_url: undefined,
      x_url: undefined,
      youtube_url: undefined,
      tiktok_url: undefined,
    },
  });

  useEffect(() => {
    if (!branch) return;
    form.reset({
      instagram_url: branch.instagram_url,
      facebook_url: branch.facebook_url,
      x_url: branch.x_url,
      youtube_url: branch.youtube_url,
      tiktok_url: branch.tiktok_url,
    });
  }, [branch, form]);
  const onSubmit = async (values: SocialMediaData) => {
    await updateSettings.mutateAsync(values, {
      onSuccess: (res) => {
        toast.success(res.message);
      },
      onError: (error) => {
        toast.error(
          error.response?.data.message ||
            "Failed to save changes. Please try again.",
        );
      },
    });
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
              name="x_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>X (formerly Twitter)</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupAddon>
                        <FaXTwitter />
                      </InputGroupAddon>
                      <InputGroupInput
                        placeholder="https://x.com/yourpage"
                        {...field}
                      />
                    </InputGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="col-span-1 md:col-span-2 flex justify-end pt-4">
              <Button
                type="submit"
                disabled={!form.formState.isDirty || isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting ? <Spinner /> : <Save />}
                {isSubmitting ? "Saving Social Links..." : " Save Social Links"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy, Loader2, LinkIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function InviteAdminPage() {
  const [loading, setLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);

  async function handleGenerate() {
    try {
      setLoading(true);
      const res = await fetch("/api/invite-token/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setInviteLink(data.inviteUrl);

      toast.success("Invite link generated successfully.");
    } catch (error: any) {
      toast.error(error.message || "Failed to generate invite link.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!inviteLink) return;
    await navigator.clipboard.writeText(inviteLink);
    toast.success("Invite link copied to clipboard.");
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Invite Link Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button
            onClick={handleGenerate}
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Invite Link"
            )}
          </Button>

          {loading && <Skeleton className="h-10 w-full rounded-md bg-muted" />}

          {inviteLink && !loading && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Invite link generated:
              </p>
              <div className="flex items-center justify-between gap-3 border rounded-lg px-4 py-2 bg-muted">
                <Link
                  href={inviteLink}
                  target="_blank"
                  className="text-primary underline underline-offset-4 flex items-center gap-1"
                >
                  <LinkIcon className="h-4 w-4" />
                  Visit Link
                </Link>
                <Button
                  onClick={handleCopy}
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                >
                  <Copy className="h-4 w-4 mr-1" /> Copy
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

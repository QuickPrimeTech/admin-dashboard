"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/card";
import { Button } from "@ui/button";
import { MailCheck, RefreshCcw } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export default function VerifyPendingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState("");

  const handleResend = async () => {
    setLoading(true);
    setError("");
    setResent(false);

    if (!email) {
      setError("No email found in URL.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    if (resendError) {
      setError("Failed to resend confirmation email.");
    } else {
      setResent(true);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl p-2">
        <CardHeader className="text-center">
          <MailCheck className="mx-auto h-10 w-10 text-primary" />
          <CardTitle className="text-2xl mt-2">Confirm Your Email</CardTitle>
          <CardDescription>
            We&apos;ve sent a confirmation link to{" "}
            <span className="font-medium text-primary">{email}</span>. <br />
            Please check your inbox to continue.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {resent && (
            <p className="text-green-600 text-sm text-center">
              ✅ Confirmation email resent!
            </p>
          )}

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <Button
            variant="secondary"
            className="w-full flex gap-2 items-center"
            onClick={handleResend}
            disabled={loading}
          >
            <RefreshCcw className="w-4 h-4" />
            {loading ? "Resending..." : "Resend Email"}
          </Button>

          <Button
            variant="ghost"
            className="w-full text-muted-foreground text-sm"
            asChild
          >
            <Link href={"/login"}>Back to Login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

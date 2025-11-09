// app/auth/verify-pending/verify-pending-skeleton.tsx

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/card";
import { Skeleton } from "@ui/skeleton";
import { MailCheck } from "lucide-react";

export function VerifyPendingSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl p-2">
        <CardHeader className="text-center">
          <MailCheck className="mx-auto h-10 w-10 text-muted-foreground" />
          <CardTitle className="text-2xl mt-2">Confirm Your Email</CardTitle>
          <CardDescription>
            We&apos;ve sent a confirmation link to{" "}
            <Skeleton className="inline-block w-28 h-4 align-middle rounded bg-gray-300" />
            .<br />
            Please check your inbox to continue.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-48 mx-auto rounded" /> {/* Message area */}
          <Skeleton className="h-10 w-full rounded" /> {/* Resend Email */}
          <Skeleton className="h-8 w-full rounded" /> {/* Back to Login */}
        </CardContent>
      </Card>
    </div>
  );
}

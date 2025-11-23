import { VerifyPendingSkeleton } from "@/sections/auth/skeletons/verify-pending";
import VerifyPendingPage from "@/sections/auth/verify-pending";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Check Your Email - QuickPrimeTech",
  description:
    "We've sent you a confirmation email. Please check your inbox to continue.",
};

export default function Page() {
  return (
    <Suspense fallback={<VerifyPendingSkeleton />}>
      <VerifyPendingPage />;
    </Suspense>
  );
}

// app/auth/verify-pending/page.tsx

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { VerifyPendingSkeleton } from "@/sections/auth/verify-pending-skeleton";

// Dynamically import the client component
const VerifyPendingPage = dynamic(
  () => import("@/sections/auth/verify-pending"),
  {
    ssr: !!false,
  }
);

export default function Page() {
  return (
    <Suspense fallback={<VerifyPendingSkeleton />}>
      <VerifyPendingPage />
    </Suspense>
  );
}

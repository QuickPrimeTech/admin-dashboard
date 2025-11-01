// app/invite-user/page.tsx

import { FeaturesPanel } from "@/sections/invite-user/features-panel";
import { InviteSignupForm } from "@/sections/invite-user/invite-form";
import { InvalidLinkMessage } from "@/sections/invite-user/invalid-message";
import { supabase } from "@/lib/server/supabase";
import { isAfter } from "date-fns";

type InviteUserPageProps = {
  searchParams: Promise<{ token: string }>;
};

// ✅ Correct Next.js Page Component Definition
export default async function InviteUserPage({
  searchParams,
}: InviteUserPageProps) {
  const { token } = await searchParams;

  if (!token || typeof token !== "string") {
    return <InvalidLinkMessage message="No invite token provided." />;
  }

  const { data, error } = await supabase
    .from("invite_tokens")
    .select("*")
    .eq("token", token)
    .single();

  if (error || !data) {
    return (
      <InvalidLinkMessage message="This is not a valid invite link. Please request a new one from QuickPrimeTech." />
    );
  }

  const expired = isAfter(new Date(), new Date(data.expires_at));

  if (expired) {
    return (
      <InvalidLinkMessage message="This invite link has expired. Please request a new one from QuickPrimeTech." />
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* <FeaturesPanel /> */}
      <InviteSignupForm />
    </div>
  );
}

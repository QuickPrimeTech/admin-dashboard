// app/invite-user/page.tsx
import { InviteSignupForm } from "@/sections/invite-user/invite-form";
import { InvalidLinkMessage } from "@/sections/invite-user/invalid-message";
import { supabase } from "@/lib/server/supabase";
import { isAfter } from "date-fns";
import { Metadata } from "next";

type InviteUserPageProps = {
  searchParams: { token?: string };
};

// 🔹 This runs before the page is rendered
export async function generateMetadata({
  searchParams,
}: InviteUserPageProps): Promise<Metadata> {
  const token = searchParams?.token;

  if (!token) {
    return { title: "Invalid Token - QuickPrimeTech" };
  }

  const { data, error } = await supabase
    .from("invite_tokens")
    .select("expires_at")
    .eq("token", token)
    .single();

  if (error || !data) {
    return { title: "Invalid Token - QuickPrimeTech" };
  }

  const expired = isAfter(new Date(), new Date(data.expires_at));

  if (expired) {
    return { title: "Expired Token - QuickPrimeTech" };
  }

  return { title: "Sign up Page - QuickPrimeTech" };
}

// 🔹 Page component
export default async function InviteUserPage({
  searchParams,
}: InviteUserPageProps) {
  const token = searchParams?.token;
  const commonRequest = "Please request a new one from QuickPrimeTech.";

  if (!token) {
    return (
      <InvalidLinkMessage
        message={`No invite token provided in the URL. ${commonRequest}`}
      />
    );
  }

  const { data, error } = await supabase
    .from("invite_tokens")
    .select("*")
    .eq("token", token)
    .single();

  if (error || !data) {
    return (
      <InvalidLinkMessage
        message={`This is not a valid invite link. ${commonRequest}`}
      />
    );
  }

  const expired = isAfter(new Date(), new Date(data.expires_at));

  if (expired) {
    return (
      <InvalidLinkMessage
        message={`This invite link has expired. ${commonRequest}`}
      />
    );
  }

  return (
    <div className="min-h-screen flex">
      <InviteSignupForm />
    </div>
  );
}

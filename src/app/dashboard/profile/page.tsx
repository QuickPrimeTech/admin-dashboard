import { ProfilePageContent } from "@/sections/profile/profile-page-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile Page",
  description: "Manage your profile settings and personal information."
};

export default function ProfilePage() {
  return (
    <ProfilePageContent />
  );
}

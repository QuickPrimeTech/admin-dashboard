import { FeaturesPanel } from "@/sections/invite-user/features-panel";
import { InviteSignupForm } from "@/sections/invite-user/invite-form";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Features Showcase */}
      <FeaturesPanel />
      {/* Right Panel - Signup Form */}
      <InviteSignupForm />
    </div>
  );
}

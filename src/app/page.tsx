import { LoginForm } from "@/sections/login/login-form";
import { LoginHero } from "@/sections/login/features-panel";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      <LoginHero />
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

// app/auth/confirm/page.tsx
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@ui/button";

export default async function ConfirmSignupPage() {
  const supabase = await createClient();

  // Get the current user (server-side)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-lg w-full bg-white p-8 rounded-xl shadow-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          {user ? "You're Logged In!" : "Oops! Something went wrong"}
        </h1>

        {user ? (
          <>
            <p className="text-gray-600 mb-6">
              Your account has already been confirmed. You can go to your admin
              dashboard to continue managing your restaurant.
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
            >
              Go to Dashboard
            </Link>
          </>
        ) : (
          <>
            <p className="text-gray-600 mb-6">
              It looks like this confirmation link has expired or is invalid.
              Please request a new confirmation email or contact support for
              help.
            </p>
            <Button asChild>
              <a href="mailto:quickprimetech@quickprimetech.com">
                Contact Support
              </a>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

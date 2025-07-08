// Reusable invalid link UI
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export const InvalidLinkMessage = () => (
  <div className="text-center py-16 px-6 max-w-lg mx-auto">
    {/* Icon with gradient background */}
    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
      <AlertTriangle className="w-8 h-8 text-white" />
    </div>

    {/* Title with gradient text */}
    <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
      Invalid or Expired Invite Link
    </h2>

    {/* Description */}
    <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
      This invitation has expired or is no longer valid. Please contact our
      support team for a new invitation.
    </p>

    {/* Contact button */}
    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-purple-500 hover:from-primary hover:to-purple-700 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl group">
      <Link
        href="mailto:support@quickprimetech.com"
        className="no-underline text-white"
      >
        Contact QuickPrimeTech Support
      </Link>
    </div>

    {/* Additional help text */}
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
      We typically respond within 24 hours
    </p>
  </div>
);

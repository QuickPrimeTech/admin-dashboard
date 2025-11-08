import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const InvalidLinkMessage = ({ message }: { message: string }) => {
  // creating the whatsapp message for somebody getting the error
  const whatsappMessage =
    "Hey, I realized my invite link was invalid. Could I please get another one?";
  const whatsappLink = `https://wa.me/254717448835?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4 mt-8">
      <Card className="w-full max-w-md text-center shadow-xl">
        <CardHeader>
          {/* Icon Container */}
          <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center shadow-md bg-destructive">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          {/* Gradient Title */}
          <CardTitle className="text-2xl mt-4 font-bold text-destructive">
            Invalid or Expired Invite Link
          </CardTitle>
        </CardHeader>

        <CardContent>
          {/* Message */}
          <p className="text-muted-foreground mb-6 leading-relaxed">
            {message}
          </p>

          {/* Support Button */}
          <Link
            href={whatsappLink}
            className="inline-block bg-linear-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-600 text-white px-5 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Contact QuickPrimeTech Support
          </Link>

          {/* Help Text */}
          <p className="text-sm text-muted-foreground mt-6">
            We typically respond within 2 hours
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

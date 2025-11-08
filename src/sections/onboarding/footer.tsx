import Link from "next/link";

export function OnboardingFooter() {
  // creating the whatsapp message for somebody getting the error
  const whatsappMessage =
    "Hey, I found a problem while creating my branch. Could you help me?";
  const whatsappLink = `https://wa.me/254717448835?text=${encodeURIComponent(
    whatsappMessage
  )}`;
  return (
    <div className="text-center mt-12">
      <p className="text-sm text-muted-foreground">
        Need help getting started?{" "}
        <Link
          className="text-primary font-medium underline-offset-4"
          target="_blank"
          rel="noreferrer noopener"
          href={whatsappLink}
        >
          Contact Support
        </Link>
      </p>
    </div>
  );
}

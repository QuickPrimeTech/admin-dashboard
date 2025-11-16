import { FAQsPageContent } from "@/sections/faqs/faq-page-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage FAQs | Dashboard",
  description:
    "Create, edit, publish, and organize frequently asked questions for your restaurant website. Manage FAQ visibility, ordering, and content from your dashboard.",
};

export default function FAQPage() {
  return <FAQsPageContent />;
}

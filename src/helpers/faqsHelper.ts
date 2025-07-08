import { FAQ } from "@/types/faqs";
import { toast } from "sonner";

export const updateFAQOrderInDB = async (faqs: FAQ[]) => {
  try {
    const payload = faqs.map((faq) => ({
      id: faq.id,
      order_index: faq.order_index,
    }));

    const res = await fetch("/api/faqs/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ updates: payload }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to reorder FAQs");
    }

    toast.success("FAQ order updated");
  } catch {
    toast.error("Error updating FAQ order");
    console.log(err);
  }
};

export function sortFaqs(faqs: FAQ[], filterValue: string): FAQ[] {
  return [...faqs].sort((a, b) => {
    switch (filterValue) {
      case "Latest":
        return b.created_at.localeCompare(a.created_at); // newest first
      case "Oldest":
        return a.created_at.localeCompare(b.created_at); // oldest first
      case "Published":
        return Number(b.is_published) - Number(a.is_published); // published first
      case "Draft":
        return Number(a.is_published) - Number(b.is_published); // drafts first
      case "Order":
        return a.order_index - b.order_index; // ascending order_index
      default:
        return 0;
    }
  });
}

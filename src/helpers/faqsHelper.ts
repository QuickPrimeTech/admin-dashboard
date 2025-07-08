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
  } catch (err) {
    toast.error("Error updating FAQ order");
  }
};

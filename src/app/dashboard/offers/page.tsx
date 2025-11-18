import { Button } from "@ui/button";
import { Plus } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Offers & Promos",
  description:
    "Manage your restaurant's special offers and promotions effortlessly using the offers management dashboard.",
};

export default function OffersPage() {
  return (
    <div className="flex flex-col gap-4 items-start lg:flex-row justify-between lg:items-center">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Offers & Promos</h1>
        <p className="text-muted-foreground">
          Manage your restaurant&apos;s special offers and promotions here.
        </p>
      </div>
      <Button asChild>
        <Link href={"/dashboard/offers/add"}>
          <Plus className="size-4" />
          Add Offer
        </Link>
      </Button>
    </div>
  );
}

import { OffersPageContent } from "@/sections/offers/offer-page-content";

export default function OffersPage() {
  return (
    <>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Offers & Promos</h1>
        <p className="text-muted-foreground">
          Manage your restaurant&apos;s special offers and promotions here.
        </p>
      </div>
      <OffersPageContent />
    </>
  );
}

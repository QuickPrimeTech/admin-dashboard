import { OffersPageContent } from "@/sections/offers/offer-page-content";

export default function OffersPage() {
  return (
    <>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Add Offer</h1>
        <p className="text-muted-foreground">
          Create and manage special offers and promotional campaigns to attract
          and retain customers.
        </p>
      </div>
      <OffersPageContent />
    </>
  );
}

"use client";

import { useBranch } from "@providers/branch-provider";
import { useOffersQuery } from "@/hooks/use-offers";
import { OfferCard } from "./offer-card";

export function OfferGrid() {
  //Get branchId from the context
  const { branchId } = useBranch();
  const { data: offers, isPending } = useOffersQuery(branchId);

  return (
    <div className="grid mt-4 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {offers &&
        offers.map((offer) => <OfferCard key={offer.id} offer={offer} />)}
    </div>
  );
}

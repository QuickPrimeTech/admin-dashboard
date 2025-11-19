"use client";

import { useBranch } from "@providers/branch-provider";
import { useOffersQuery } from "@/hooks/use-offers";
import { OfferCard } from "./offer-card";
import { OfferCardSkeleton } from "./skeletons/offer-card-skeleton";

export function OfferGrid() {
  //Get branchId from the context
  const { branchId } = useBranch();
  const { data: offers, isPending } = useOffersQuery(branchId);

  return (
    <div className="grid mt-8 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {isPending &&
        Array.from({ length: 3 }, (_, idx) => <OfferCardSkeleton key={idx} />)}
      {offers &&
        offers.map((offer) => <OfferCard key={offer.id} offer={offer} />)}
    </div>
  );
}

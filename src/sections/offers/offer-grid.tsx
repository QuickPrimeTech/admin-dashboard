"use client";

import { useBranch } from "@providers/branch-provider";
import { useOffersQuery } from "@/hooks/use-offers";
import { OfferCard } from "./offer-card";
import { OfferCardSkeleton } from "./skeletons/offer-card-skeleton";
import {
  EmptyState,
  EmptyStateAction,
  EmptyStateDescription,
  EmptyStateTitle,
} from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export function OfferGrid() {
  //Get branchId from the context
  const { branchId } = useBranch();
  const { data: offers, isPending } = useOffersQuery(branchId);

  if (offers?.length === 0) {
    return (
      <EmptyState>
        <EmptyStateTitle>No offers created yet 🎉</EmptyStateTitle>
        <EmptyStateDescription>
          You have not added any offers yet. Click the button below to add your
          first offer.
        </EmptyStateDescription>
        <EmptyStateAction>
          <Button asChild>
            <Link href="/dashboard/offers/add">
              <Plus /> Create Offer
            </Link>
          </Button>
        </EmptyStateAction>
      </EmptyState>
    );
  }
  return (
    <div className="grid mt-8 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {isPending &&
        Array.from({ length: 3 }, (_, idx) => <OfferCardSkeleton key={idx} />)}
      {offers &&
        offers.map((offer) => <OfferCard key={offer.id} offer={offer} />)}
    </div>
  );
}

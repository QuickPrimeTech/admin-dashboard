import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import { Offer } from "@/types/offers";

type OfferPreviewProps = {
  offer: Offer;
};
export function OfferPreview({ offer }: OfferPreviewProps) {
  return (
    <Card
      key={offer.id}
      className="py-0 group overflow-hidden border hover:shadow-xl transition-all duration-300"
    >
      <CardContent className="p-0 relative">
        <div className="relative aspect-4/3 w-full overflow-hidden">
          {/* NEXT IMAGE WITH FILL */}
          <Image
            src={offer.image}
            alt={offer.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 33vw"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

          {/* Badge */}
          {/* {offer.badge && (
            <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground font-semibold">
              {offer.badge}
            </Badge>
          )} *

          {/* Text Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-2xl font-bold mb-2 transition-transform group-hover:-translate-y-1">
              {offer.title}
            </h3>

            <p className="text-sm text-white/90 mb-4">{offer.description}</p>

            {/* BUTTON WITH ICON TRANSITION */}
            <Button size={"sm"} className="relative overflow-hidden">
              Order Now
              {/* Default Icon (Bag) */}
              <ShoppingBag />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { Offer } from "./offers-data";

interface AdminOfferPreviewProps {
  offer: Partial<Offer>;
  mediaPreview?: string;
}

export function AdminOfferPreview({
  offer,
  mediaPreview,
}: AdminOfferPreviewProps) {
  const isVideo = offer.isVideo;

  return (
    <div className="rounded-lg overflow-hidden border border-neutral-200 bg-neutral-900 shadow-xl">
      {/* Media Container - matches showcase dimensions */}
      <div className="relative h-80 bg-neutral-800 flex items-center justify-center overflow-hidden group">
        {mediaPreview ? (
          <>
            {isVideo ? (
              <>
                <video
                  src={mediaPreview}
                  className="w-full h-full object-cover"
                  controls
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
              </>
            ) : (
              <img
                src={mediaPreview || "/placeholder.svg"}
                alt="Offer preview"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            )}
          </>
        ) : (
          <div className="text-center text-neutral-500">
            <div className="text-4xl mb-2">📸</div>
            <p className="text-sm">Upload image or video</p>
          </div>
        )}
      </div>

      {/* Overlay Content - matches showcase styling */}
      <div className="relative bg-gradient-to-t from-black/80 to-black/20 p-6 min-h-64 flex flex-col justify-end">
        {mediaPreview && (
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent pointer-events-none" />
        )}

        <div className="relative z-10 space-y-3">
          {/* Discount Badge */}
          {offer.discount && (
            <div className="inline-block bg-amber-600 text-white px-4 py-2 rounded-full font-semibold text-sm">
              {offer.discount}
            </div>
          )}

          {/* Title */}
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-white line-clamp-3">
            {offer.title || "Offer Title"}
          </h3>

          {/* Description */}
          <p className="text-sm md:text-base text-amber-50/80 line-clamp-3 leading-relaxed">
            {offer.description || "Your offer description will appear here"}
          </p>

          {/* CTA Button */}
          <button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-semibold transition-colors duration-200 text-base md:text-lg mt-4">
            {offer.cta || "Order Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

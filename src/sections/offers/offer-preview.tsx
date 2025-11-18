"use client";

import { Offer } from "./offers-data";

interface OfferPreviewProps {
  offer: Partial<Offer>;
  mediaPreview?: string;
}

export function OfferPreview({ offer, mediaPreview }: OfferPreviewProps) {
  const isVideo = offer.isVideo;

  return (
    <div className="rounded-lg overflow-hidden border border-neutral-200 bg-neutral-900">
      {/* Media Container */}
      <div className="relative h-64 bg-neutral-800 flex items-center justify-center overflow-hidden group">
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
                alt="Preview"
                className="w-full h-full object-cover"
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

      {/* Overlay Content */}
      <div className="relative h-64 bg-gradient-to-t from-black/80 to-black/20 p-6 flex flex-col justify-end">
        {mediaPreview && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
        )}

        <div className="relative z-10">
          <h2 className="text-2xl font-serif font-bold text-white mb-2 line-clamp-2">
            {offer.title || "Offer Title"}
          </h2>

          <p className="text-sm text-neutral-300 mb-4 line-clamp-2">
            {offer.description || "Your offer description will appear here"}
          </p>

          {offer.discount && (
            <div className="inline-block bg-amber-600 text-white px-4 py-2 rounded-full font-semibold mb-4">
              {offer.discount}
            </div>
          )}

          <button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg font-semibold transition-colors">
            {offer.cta || "Call to Action"}
          </button>
        </div>
      </div>
    </div>
  );
}

import { MapPin, Package, ExternalLink } from "lucide-react";
import { StatusBadge } from "../ui/Badge";

const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function DonationCard({ donation, selected, onSelect }) {
  return (
    <div
      role="option"
      aria-selected={selected}
      className={`bg-white border rounded-2xl p-4 flex gap-4 items-start cursor-pointer hover:shadow-soft transition-all ${
        selected ? "ring-2 ring-primary border-primary/30" : "border-gray-100 hover:border-gray-200"
      }`}
      onClick={() => onSelect(selected ? null : donation.id)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect(selected ? null : donation.id)}
      tabIndex={0}
    >
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <Package className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <h4 className="font-semibold text-ink text-sm">{donation.food_type}</h4>
          <StatusBadge status={donation.status} />
        </div>
        <p className="text-xs text-gray-400 mb-2">
          {donation.quantity} {donation.unit}
        </p>
        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="truncate">{donation.pickup_address}</span>
        </div>
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(donation.pickup_address)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
          aria-label={`Open ${donation.pickup_address} in Google Maps`}
        >
          Open in Maps <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

/**
 * Shows a list of donation locations. When VITE_GOOGLE_MAPS_API_KEY is set,
 * the selected donation shows an embedded map. Falls back to styled address cards.
 */
export function DonationMap({ donations, selectedId, onSelect }) {
  const selected = donations.find((d) => d.id === selectedId);

  return (
    <div className="grid md:grid-cols-2 gap-4" role="listbox" aria-label="Available donations">
      {/* List side */}
      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
        {donations.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-8">No donations to display.</p>
        )}
        {donations.map((d) => (
          <DonationCard
            key={d.id}
            donation={d}
            selected={d.id === selectedId}
            onSelect={onSelect}
          />
        ))}
      </div>

      {/* Map / Detail side */}
      <div className="rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center min-h-[280px]">
        {selected ? (
          MAPS_KEY ? (
            <iframe
              title={`Map for ${selected.food_type}`}
              src={`https://www.google.com/maps/embed/v1/place?key=${MAPS_KEY}&q=${encodeURIComponent(selected.pickup_address)}&zoom=15`}
              className="w-full h-full min-h-[280px] border-0"
              loading="lazy"
              allowFullScreen
            />
          ) : (
            <div className="p-6 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <MapPin className="w-7 h-7 text-primary" />
              </div>
              <p className="font-semibold text-ink text-sm">{selected.pickup_address}</p>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(selected.pickup_address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                Open in Google Maps <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )
        ) : (
          <div
            className="w-full h-full min-h-[280px] rounded-2xl flex items-center justify-center"
            style={{
              backgroundImage: "radial-gradient(circle, #e5e7eb 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          >
            <div className="text-center p-6">
              <MapPin className="w-10 h-10 mx-auto mb-2 text-gray-200" />
              <p className="text-sm text-gray-400">Select a donation to preview its location</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

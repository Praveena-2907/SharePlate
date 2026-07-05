import { MapPin, Package, ExternalLink } from "lucide-react";
import { StatusBadge } from "../ui/Badge";

const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function MapsPlaceholderCard({ donation }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4 items-start hover:shadow-soft transition-shadow">
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
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(donation.pickup_address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
        >
          <MapPin className="w-3 h-3" />
          {donation.pickup_address}
          <ExternalLink className="w-3 h-3 ml-0.5" />
        </a>
      </div>
    </div>
  );
}

/**
 * Shows a list of donation locations. When VITE_GOOGLE_MAPS_API_KEY is set,
 * each selected donation shows an embedded map. Falls back to styled address cards.
 */
export function DonationMap({ donations, selectedId, onSelect }) {
  const selected = donations.find((d) => d.id === selectedId);

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* List side */}
      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
        {donations.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-8">No donations to display.</p>
        )}
        {donations.map((d) => (
          <button
            key={d.id}
            onClick={() => onSelect?.(d.id === selectedId ? null : d.id)}
            className={`w-full text-left transition-all ${
              d.id === selectedId
                ? "ring-2 ring-primary rounded-2xl"
                : "hover:ring-1 hover:ring-gray-200 rounded-2xl"
            }`}
          >
            <MapsPlaceholderCard donation={d} />
          </button>
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
              <p className="text-xs text-gray-400 mt-4">
                Add <code className="bg-gray-100 px-1 rounded">VITE_GOOGLE_MAPS_API_KEY</code> to enable embedded maps.
              </p>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center gap-3 text-gray-400">
            <div
              className="w-full h-full min-h-[280px] rounded-2xl flex items-center justify-center"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #e5e7eb 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            >
              <div className="text-center p-6">
                <MapPin className="w-10 h-10 mx-auto mb-2 text-gray-200" />
                <p className="text-sm text-gray-400">Select a donation to preview its location</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { MapPin, Navigation, ExternalLink, ArrowRight } from "lucide-react";

const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const STATUS_STEPS = ["assigned", "picked_up", "in_transit", "delivered"];
const STEP_LABELS = {
  assigned:   "Ready for pickup",
  picked_up:  "Food picked up",
  in_transit: "En route to NGO",
  delivered:  "Delivered ✓",
};

function ProgressStepper({ status }) {
  const currentIdx = STATUS_STEPS.indexOf(status);
  return (
    <div className="flex items-center gap-1 mb-4">
      {STATUS_STEPS.map((step, i) => (
        <div key={step} className="flex items-center gap-1 flex-1 last:flex-none">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-colors ${
              i < currentIdx
                ? "bg-primary text-white"
                : i === currentIdx
                ? "bg-primary text-white ring-4 ring-primary/20"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            {i < currentIdx ? "✓" : i + 1}
          </div>
          {i < STATUS_STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 ${i < currentIdx ? "bg-primary" : "bg-gray-100"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * Shows pickup → delivery route. Embeds Google Maps directions when the API
 * key is set. Always shows address cards and a "Get Directions" link.
 */
export function RouteMap({ donation, className = "" }) {
  const { pickup_address, food_type, quantity, unit, status } = donation;
  const destination = "Partner NGO";
  const mapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(pickup_address)}&travelmode=driving`;

  return (
    <div className={`space-y-4 ${className}`}>
      <ProgressStepper status={status} />
      <p className="text-xs text-gray-400 text-center -mt-2 mb-2 font-medium">
        {STEP_LABELS[status] ?? "In progress"}
      </p>

      {/* Address route card */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-3">
        <div className="flex gap-3 items-start">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
            <MapPin className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 mb-0.5">Pickup</p>
            <p className="text-sm font-semibold text-ink">{pickup_address}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {quantity} {unit} • {food_type}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 pl-4">
          <div className="w-0.5 h-8 bg-gray-200 ml-3.5" />
          <ArrowRight className="w-4 h-4 text-gray-300" />
        </div>

        <div className="flex gap-3 items-start">
          <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 mt-0.5">
            <Navigation className="w-4 h-4 text-secondary" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 mb-0.5">Drop-off</p>
            <p className="text-sm font-semibold text-ink">Partner NGO</p>
            <p className="text-xs text-gray-400 mt-0.5">Donation #{donation.id}</p>
          </div>
        </div>
      </div>

      {/* Embedded map or placeholder */}
      {MAPS_KEY ? (
        <div className="rounded-xl overflow-hidden border border-gray-100 shadow-soft">
          <iframe
            title={`Route for donation #${donation.id}`}
            src={`https://www.google.com/maps/embed/v1/place?key=${MAPS_KEY}&q=${encodeURIComponent(pickup_address)}&zoom=14`}
            className="w-full h-48 border-0"
            loading="lazy"
            allowFullScreen
          />
        </div>
      ) : (
        <div
          className="rounded-xl h-32 flex items-center justify-center border border-gray-100"
          style={{
            backgroundImage: "radial-gradient(circle, #e5e7eb 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        >
          <p className="text-xs text-gray-400 bg-white/80 px-3 py-1.5 rounded-full">
            Add <code className="bg-gray-100 px-1 rounded">VITE_GOOGLE_MAPS_API_KEY</code> for live maps
          </p>
        </div>
      )}

      <a
        href={mapsDirectionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full bg-white border border-gray-200 hover:border-primary text-ink hover:text-primary py-3 rounded-xl font-semibold text-sm transition-colors shadow-soft"
      >
        <Navigation className="w-4 h-4" />
        Get Directions
        <ExternalLink className="w-3.5 h-3.5 opacity-60" />
      </a>
    </div>
  );
}

import { MapPin, ExternalLink } from "lucide-react";

const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

/**
 * Address input field. When VITE_GOOGLE_MAPS_API_KEY is set, also shows a
 * live map thumbnail via Google Maps Embed. Falls back to a clean text input.
 */
export function LocationPicker({ value, onChange, placeholder = "Enter pickup address", required = false, className = "" }) {
  const mapsQuery = value ? `https://www.google.com/maps/embed/v1/place?key=${MAPS_KEY}&q=${encodeURIComponent(value)}&zoom=14` : null;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="relative">
        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
          aria-label="Pickup address"
        />
      </div>

      {MAPS_KEY && value && value.length > 5 && (
        <div className="rounded-xl overflow-hidden border border-gray-100 shadow-soft">
          <iframe
            title="Location preview"
            src={mapsQuery}
            className="w-full h-48 border-0"
            loading="lazy"
            allowFullScreen
          />
        </div>
      )}

      {!MAPS_KEY && value && (
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(value)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline"
        >
          <ExternalLink className="w-3 h-3" />
          View on Google Maps
        </a>
      )}
    </div>
  );
}

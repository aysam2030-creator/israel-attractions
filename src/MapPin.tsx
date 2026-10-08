import { memo } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { Attraction } from "./data/attractions";
import type { Lang } from "./i18n";

const pinCache = new Map<string, L.DivIcon>();

function getCachedPin(color: string, isTrip: boolean, step?: number) {
  const key = `${color}-${isTrip}-${step ?? "none"}`;
  if (!pinCache.has(key)) {
    const stepHtml = step !== undefined ? `<div class="pin-step">${step}</div>` : "";
    const icon = L.divIcon({
      className: "custom-pin",
      html: `<div class="pin ${isTrip ? "pin-trip" : ""}" style="--pin:${color}"><div class="pin-inner"></div>${stepHtml}</div>`,
      iconSize: [28, 36],
      iconAnchor: [14, 34],
      popupAnchor: [0, -32],
    });
    pinCache.set(key, icon);
  }
  return pinCache.get(key)!;
}

interface MapPinProps {
  a: Attraction;
  lang: Lang;
  isTrip: boolean;
  step?: number;
  color: string;
  onSelect: (a: Attraction) => void;
}

export const MapPin = memo(function MapPin({ a, lang, isTrip, step, color, onSelect }: MapPinProps) {
  return (
    <Marker
      position={[a.lat, a.lng]}
      icon={getCachedPin(color, isTrip, step)}
      eventHandlers={{ click: () => onSelect(a) }}
    >
      <Popup>
        <div className="popup">
          <strong>{a.name[lang]}</strong>
          <div className="popup-city">{a.city[lang]}</div>
        </div>
      </Popup>
    </Marker>
  );
});

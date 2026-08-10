#!/bin/bash
# Insert comments above iconCache and AttractionMarker

sed -i 's/const iconCache = new Map<string, L.DivIcon>();/\/\/ Cache L.divIcon instances to prevent creating new DOM elements and Leaflet objects on every re-render\nconst iconCache = new Map<string, L.DivIcon>();/' src/App.tsx

sed -i 's/const AttractionMarker = memo(function AttractionMarker({ a, lang, color, isTrip, step, onSelect }: AttractionMarkerProps) {/\/\/ Memoized marker component to prevent unnecessary re-renders when parent state changes\nconst AttractionMarker = memo(function AttractionMarker({ a, lang, color, isTrip, step, onSelect }: AttractionMarkerProps) {/' src/App.tsx

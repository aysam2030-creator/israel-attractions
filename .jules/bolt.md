## 2026-05-29 - Memoize react-leaflet wrapper props
**Learning:** Leaflet components like `<Marker>` and `<Polyline>` are highly sensitive to inline object references (like `L.divIcon`, inline `pathOptions`, and mapped arrays). Re-creating these on every React render forces the underlying DOM elements to be destroyed and recreated, causing massive thrashing and performance drops.
**Action:** Always extract static options to constants, use `useMemo` for derived props, and cache `L.divIcon` instances with a Map outside the component to guarantee stable references.

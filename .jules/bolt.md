## 2026-07-11 - React-Leaflet Reference Thrashing
**Learning:** React-Leaflet is highly sensitive to object reference changes, causing severe DOM thrashing if Leaflet objects like `L.divIcon` or path options objects are recreated on every render.
**Action:** Always cache or memoize dynamically generated Leaflet objects (e.g., using an external `Map` for `L.divIcon` with varied arguments, or stable constants for polyline options) and use `useMemo` for path arrays.

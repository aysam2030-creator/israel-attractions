## 2024-08-11 - Cached L.divIcon & Memoized React-Leaflet Markers
**Learning:** In `react-leaflet`, passing dynamically generated objects (like `L.divIcon` created inside a map loop) to props or inline event handlers creates new object references on every render, causing severe DOM thrashing as Leaflet re-creates the markers.
**Action:** Extract Leaflet elements like `<Marker>` into separate `React.memo()` components and cache dynamic Leaflet objects (like `L.DivIcon`) using an external `Map` keyed by stringified arguments to ensure stable object references and prevent unnecessary re-renders.

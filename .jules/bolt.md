## 2026-06-17 - Prevent DOM Thrashing with React-Leaflet
**Learning:** Leaflet properties (like `L.divIcon`, polyline paths, and options objects) create new references on every render, which triggers expensive DOM thrashing and severe performance bottlenecks in react-leaflet.
**Action:** Always cache or memoize these properties (e.g. using a Map for icons and constants for options) to maintain stable object references across renders.

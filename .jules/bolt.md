## 2025-02-14 - React-Leaflet L.divIcon Caching
**Learning:** Recreating dynamically generated objects like `L.divIcon` inside a component loop on every render in react-leaflet causes significant DOM thrashing and performance degradation.
**Action:** Always cache dynamically generated Leaflet objects (like `L.divIcon`) using an external `Map` based on a composite key of their parameters rather than recreating them during each render cycle.

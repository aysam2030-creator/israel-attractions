## 2024-05-15 - [Caching Leaflet Icons]
**Learning:** Leaflet creates a new DOM element for every custom `L.divIcon` instantiation, causing DOM thrashing when a large list of map markers triggers re-renders. `react-leaflet` doesn't natively cache these icons.
**Action:** Always cache dynamically generated `L.divIcon` instances using an external `Map` based on a composite key of their rendering parameters to prevent excessive memory usage and rendering delays during map updates.

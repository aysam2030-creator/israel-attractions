## 2025-02-23 - Caching react-leaflet icons
**Learning:** React-leaflet recreates DOM nodes if Leaflet icon instances change reference on every render. Creating `L.divIcon` inside a render loop causes severe DOM thrashing and memory pressure.
**Action:** Always cache dynamically generated `L.divIcon` instances using an external `Map` based on a composite key of their parameters.

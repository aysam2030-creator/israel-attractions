## 2024-10-30 - Cache Leaflet DivIcons
**Learning:** Recreating `L.divIcon` on every render in a map component loop causes DOM thrashing and memory bloat in react-leaflet.
**Action:** Cache dynamically generated objects like `L.divIcon` instances using an external `Map` based on a composite key of their parameters.

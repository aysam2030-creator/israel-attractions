## 2024-10-19 - [Leaflet Icon Caching]
**Learning:** Leaflet divIcon components inside a map iteration loop cause react-leaflet to recreate DOM nodes unnecessarily on every render.
**Action:** Cache dynamically generated L.divIcon instances using an external Map based on a composite key to optimize performance and prevent DOM thrashing in react-leaflet.

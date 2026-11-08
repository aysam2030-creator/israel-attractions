## 2025-02-15 - Leaflet DivIcon Caching
**Learning:** In react-leaflet, creating new L.divIcon instances inside component render loops (e.g. mapping over markers) causes severe DOM thrashing and performance degradation, as Leaflet recreates the underlying DOM elements.
**Action:** Always cache dynamically generated L.divIcon objects using an external Map based on a composite key of their parameters instead of recreating them on every render.

## 2024-11-12 - Cache Leaflet Icons
**Learning:** In react-leaflet, dynamically generating L.divIcon instances on every render causes significant DOM thrashing and performance degradation, especially with many markers.
**Action:** Always cache L.divIcon instances using an external Map based on a composite key of their parameters.

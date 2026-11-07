## 2024-11-08 - React-Leaflet Marker DOM Thrashing
**Learning:** Re-creating L.divIcon instances on every component render inside a loop causes DOM thrashing and performance degradation in react-leaflet.
**Action:** Cache dynamically generated objects like L.divIcon instances using an external Map based on a composite key of their parameters, rather than recreating them on every component render.

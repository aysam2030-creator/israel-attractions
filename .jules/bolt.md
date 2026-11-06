## 2024-11-06 - React-Leaflet L.divIcon Thrashing
**Learning:** In react-leaflet, recreating `L.divIcon` instances on every render inside a loop breaks Leaflet's internal equality checks, causing expensive DOM thrashing as markers are destroyed and re-created continuously.
**Action:** Cache dynamically generated `L.divIcon` objects outside the component (using an external `Map` and a composite key) to reuse instances and preserve react-leaflet performance.

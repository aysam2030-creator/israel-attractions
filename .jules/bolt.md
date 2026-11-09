## 2025-01-20 - [Performance] Cache dynamically generated objects in react-leaflet
**Learning:** To optimize performance and prevent DOM thrashing in react-leaflet, cache dynamically generated objects like `L.divIcon` instances using an external `Map` based on a composite key of their parameters, rather than recreating them on every component render inside a loop.
**Action:** When working with Leaflet custom markers, implement a caching mechanism to reuse `L.divIcon` instances based on properties like color and trip status.

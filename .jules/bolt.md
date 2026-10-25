## 2023-10-25 - Prevent DOM thrashing in react-leaflet by caching dynamically generated objects
**Learning:** In react-leaflet, creating new `L.divIcon` objects inside a component loop on every render can cause severe DOM thrashing and performance degradation, because the map re-initializes markers for new icon instances even if visually identical.
**Action:** Cache dynamically generated objects like `L.divIcon` instances using an external `Map` based on a composite key of their parameters, rather than recreating them on every component render inside a loop.

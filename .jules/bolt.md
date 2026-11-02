## 2024-11-03 - Cache dynamically generated react-leaflet icons
**Learning:** React-leaflet recreating `L.divIcon` objects on every component render inside a loop causes unnecessary memory allocations and DOM thrashing.
**Action:** Cache dynamically generated objects like `L.divIcon` instances using an external `Map` based on a composite key of their parameters, rather than recreating them on every component render inside a loop.

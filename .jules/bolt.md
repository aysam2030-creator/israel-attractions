## 2024-11-10 - Leaflet DivIcon Caching
**Learning:** In react-leaflet, dynamically generating `L.divIcon` instances on every component render inside a loop causes memory thrashing and unnecessary DOM manipulation because the underlying Leaflet library treats every newly created icon as a distinct object.
**Action:** Always cache Leaflet icons (like `L.divIcon`) using an external `Map` based on a composite key of their parameters when they are used inside `Array.map` or frequently re-rendered components, to reuse existing objects and prevent unnecessary recreation.

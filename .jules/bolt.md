## 2025-09-25 - Prevent DOM thrashing in react-leaflet
**Learning:** In react-leaflet, passing inline objects to `eventHandlers` prop inside map loops creates new references on every render, and dynamically recreating `L.divIcon` without caching causes DOM thrashing.
**Action:** Extract Leaflet elements into `React.memo` components, pass evaluated primitive values instead of complex objects to ensure shallow comparison works, and use an external `Map` to cache `L.divIcon` instances.

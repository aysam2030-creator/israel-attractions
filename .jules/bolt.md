## 2024-10-24 - Optimize React-Leaflet Map Renders
**Learning:** In react-leaflet, inline objects/functions passed as props (like `eventHandlers` or `L.divIcon` instances for markers) cause expensive child component re-renders because their object references change on every parent render cycle, leading to severe DOM thrashing.
**Action:** Extract map elements (like `<Marker>`) into separate `React.memo()` components. Use `useMemo` or external `Map` caches to stabilize prop references (e.g., caching dynamically generated `L.divIcon` instances by a stringified key).

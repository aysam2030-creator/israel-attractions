
## 2024-05-18 - Caching Leaflet object instances
**Learning:** React-Leaflet is highly sensitive to reference equality of Leaflet primitives (like `L.divIcon` and `eventHandlers` on `<Marker>`). Passing these inline causes severe DOM thrashing because Leaflet tears down and recreates map nodes on every render.
**Action:** Always cache complex Leaflet options (`L.divIcon` using external Maps or `useMemo` for stable configs) and isolate markers into `React.memo` components with stabilized event handlers.

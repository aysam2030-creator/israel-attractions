## 2026-07-29 - Memoizing Leaflet icons prevents severe DOM thrashing
**Learning:** In react-leaflet, unmemoized `L.divIcon` calls inside render loops cause the map to unnecessarily destroy and recreate markers on every render (DOM thrashing), severely degrading performance.
**Action:** Always cache or memoize dynamically generated Leaflet properties, such as `L.divIcon` or inline option objects, using external Maps or `useMemo`.

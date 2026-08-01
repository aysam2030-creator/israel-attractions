## 2026-08-01 - Leaflet Property Re-Renders
**Learning:** React-Leaflet recreates instances on every render if prop objects (like `icon` and `pathOptions`) or coordinate arrays (like `positions`) are defined inline or remachined un-memoized on each render. This causes massive DOM thrashing and CPU bottlenecks for maps with many markers.
**Action:** Always memoize `L.divIcon` using an external Map or `useMemo`, pull constant option objects outside the component, and memoize mapped coordinate arrays using `useMemo` when passing them to Leaflet.

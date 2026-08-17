## 2024-08-17 - React-Leaflet Marker Memoization
**Learning:** Passing inline objects to Leaflet properties like `eventHandlers` and recreating `L.divIcon` objects dynamically on every render causes severe performance issues from DOM thrashing.
**Action:** Extract Leaflet markers into separate memoized components and cache the dynamically generated `L.divIcon` objects using a `Map` based on stringified keys.

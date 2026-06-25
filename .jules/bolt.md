## 2026-06-25 - Memoizing react-leaflet Objects
**Learning:** In React Leaflet, re-creating objects like `L.divIcon` or inline arrays (e.g. polyline positions) during renders causes the map library to rapidly destroy and re-create DOM nodes, leading to severe visual thrashing and lag.
**Action:** When working with Leaflet properties such as markers and polylines, always cache `L.divIcon` instances in a `Map` (since they are external to React's lifecycle) and memoize coordinate arrays and options objects with `useMemo` or external constants.

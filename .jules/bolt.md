## 2024-11-05 - React-Leaflet DOM Thrashing
**Learning:** Recreating `L.divIcon` instances on every render in a map loop causes `react-leaflet` to unnecessarily recreate DOM nodes, leading to severe DOM thrashing.
**Action:** Cache dynamically generated `L.divIcon` instances using an external `Map` based on a composite key of their parameters.

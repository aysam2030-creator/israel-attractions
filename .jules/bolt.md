## 2026-05-15 - Prevent React-Leaflet DOM Thrashing
**Learning:** In React-Leaflet, passing inline objects/arrays (like `center={[31.5, 34.9]}` or `pathOptions={{...}}`) and creating new `L.divIcon` instances on every render causes severe DOM thrashing because Leaflet assumes the properties changed.
**Action:** Always hoist static Leaflet props to module-level constants and use a cache/memoization for dynamic Leaflet objects like `L.divIcon` to maintain stable object references.

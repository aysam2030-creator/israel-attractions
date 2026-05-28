## 2024-05-28 - React-Leaflet Render Thrashing
**Learning:** Passing inline options objects (like `pathOptions`) or creating new Leaflet instances (like `L.divIcon`) on every render in React-Leaflet causes severe DOM thrashing as Leaflet recreates the map elements.
**Action:** Always extract static options objects outside the component and use a memoization cache for dynamically generated `L.divIcon` instances.

## 2024-05-18 - [React-Leaflet DOM Thrashing]
**Learning:** Recreating `L.divIcon` instances and inline `eventHandlers` objects inside `react-leaflet` marker loops on every render causes severe DOM thrashing, as Leaflet destroys and recreates marker nodes.
**Action:** Extract Leaflet marker elements into `React.memo` components, pass primitive props, and cache dynamically generated `L.divIcon` objects in an external `Map` based on a composite key.

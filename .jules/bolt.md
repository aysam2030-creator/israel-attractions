
## 2024-06-18 - Leaflet Map Marker Performance Optimization
**Learning:** In a React app using `react-leaflet`, recreating leaflet property objects (like `L.divIcon`, `pathOptions`, and event handlers) on every render causes severe performance bottlenecks due to DOM thrashing as Leaflet recreates DOM nodes.
**Action:** Always cache or extract `L.divIcon` instances, use stable constants for polyline `pathOptions`, and wrap react-leaflet map markers in `React.memo` with memoized props (`useMemo` for positions and eventHandlers) to ensure stable references across renders.

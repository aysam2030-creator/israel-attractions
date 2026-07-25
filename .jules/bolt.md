## 2026-07-25 - Leaflet Marker and Polyline Optimization
**Learning:** Recreating Leaflet objects like `L.divIcon` or inline option objects on every render can cause significant performance degradation and DOM thrashing in react-leaflet.
**Action:** Use an external Map to cache dynamically generated Leaflet objects (like icons) based on a stringified key, and hoist static options objects out of the render cycle.

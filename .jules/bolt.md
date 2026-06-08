## 2024-03-24 - Leaflet Object Creation DOM Thrashing
**Learning:** Calling `L.divIcon` and passing unmemoized objects (like array coordinates for `Polyline` or inline `pathOptions`) on every React render causes severe DOM thrashing in react-leaflet, even if the underlying values haven't changed.
**Action:** Always cache or memoize Leaflet objects (icons, polylines, path options) to maintain stable references across renders.

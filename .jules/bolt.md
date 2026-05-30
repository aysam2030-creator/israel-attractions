## 2024-05-30 - react-leaflet DOM Thrashing
**Learning:** Passing unstable references to `react-leaflet` components (like dynamically generated `L.divIcon`, inline `pathOptions` objects, or newly mapped coordinate arrays) causes severe DOM thrashing because Leaflet aggressively destroys and recreates elements on every render when these props change.
**Action:** Always memoize, extract to static constants, or use external caches (like a `Map`) for objects and arrays passed to `react-leaflet` props to maintain referential equality across React renders.

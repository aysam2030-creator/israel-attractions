## 2024-05-15 - Unmemoized react-leaflet Properties Cause DOM Thrashing
**Learning:** Passing inline options (like `pathOptions={{ color: "red" }}`) or creating new `L.divIcon` instances on every render causes react-leaflet to re-initialize map layers, leading to significant DOM thrashing and performance degradation.
**Action:** Always cache Leaflet custom icons using a map/dictionary, extract static options objects (like `pathOptions`) to module-level constants, and use `useMemo` for array props like `positions` when the underlying data is stable.

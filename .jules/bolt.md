## 2024-05-24 - Optimizing react-leaflet DOM Thrashing
**Learning:** React-leaflet components thrash the DOM if dynamically generated Leaflet objects (like `L.divIcon` for Markers or `pathOptions` objects for Polylines) are recreated on every render, as they don't have stable references.
**Action:** Use an external `Map` to cache dynamically generated icons based on a stringified key, move static option objects outside of the component to make them constants, and wrap arrays mapping functions like route generation in `useMemo`.

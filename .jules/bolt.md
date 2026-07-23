## 2024-05-14 - React-Leaflet object reference thrashing
**Learning:** In react-leaflet, passing inline objects (like `L.divIcon` or dynamic path arrays) as props causes the underlying Leaflet library to completely tear down and recreate DOM nodes on every React render, leading to severe DOM thrashing and performance bottlenecks.
**Action:** Always cache or memoize dynamically generated Leaflet objects (using an external `Map` for icons or `useMemo` for path arrays) to maintain referential stability across renders.

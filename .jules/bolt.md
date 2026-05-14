## 2024-05-24 - Stable object references in react-leaflet
**Learning:** react-leaflet components (like Marker, Polyline) are highly sensitive to unstable object references for properties like `icon` (`L.divIcon`), `positions`, and `pathOptions`. Passing new object instances on every render causes severe performance bottlenecks due to continuous destruction and recreation of Leaflet DOM elements (DOM thrashing).
**Action:** Always cache or memoize Leaflet properties (using `useMemo`, module-level constants, or custom cache Maps) to maintain stable object references across React renders.

## 2024-05-25 - Prevent DOM thrashing in react-leaflet Markers
**Learning:** In `react-leaflet`, passing inline generated icons (like `L.divIcon` from `makePin`) to `Marker` components forces the underlying Leaflet instance to be recreated on every render. This leads to severe performance bottlenecks (DOM thrashing) when rendering many markers or updating state frequently.
**Action:** Always cache or memoize Leaflet icon objects (e.g., using a `Map` outside the component) and properties like `pathOptions` to maintain stable object references across React renders.

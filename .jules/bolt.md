## 2024-07-03 - Memoize Leaflet properties to prevent DOM thrashing

**Learning:** When working with react-leaflet in this codebase, ensure Leaflet properties (like `L.divIcon`, polyline paths, and options objects) are cached or memoized. Otherwise, they are recreated on every render, causing the React Leaflet wrappers to destroy and recreate the underlying DOM elements, leading to severe performance bottlenecks.
**Action:** When adding or updating `react-leaflet` components, wrap object props and functions returning Leaflet instances in `useMemo`, or extract them outside the component.

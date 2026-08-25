## 2024-05-30 - Leaflet Marker Rendering
**Learning:** `react-leaflet` components like `Marker` use underlying `leaflet` instances. Passing a new `L.divIcon` instance or inline object to `eventHandlers` prop on every render will cause the Leaflet components to constantly re-render or even recreate DOM elements (DOM thrashing).
**Action:** Extract marker components to memoized React components and use a map cache for icon instances.

## 2025-02-09 - Memoizing Leaflet Markers in react-leaflet
**Learning:** In `react-leaflet`, calling `L.divIcon` repeatedly creates new icon instances on every component render. When passed directly to `<Marker>`, it causes expensive Leaflet DOM thrashing (removing and recreating marker DOM nodes).
**Action:** Always cache Leaflet Icon objects (e.g., using a `Map` based on a composite key) and extract `<Marker>` elements into standalone `React.memo` components when rendering inside large lists or frequently updating parent components. Ensure `eventHandlers` are memoized using `useMemo`.

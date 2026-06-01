
## 2024-05-24 - React-Leaflet Marker Thrashing
**Learning:** Leaflet's `Marker` component forces DOM recreation if non-primitive props (like `icon` or `eventHandlers`) change references between renders. Simply using `makePin()` inline or creating arrow functions in `eventHandlers` causes severe performance bottlenecks when filtering or typing in search.
**Action:** Always memoize Leaflet elements. Create a separate component wrapped in `React.memo` for list items, cache `L.divIcon` instances outside the render loop, and use `useCallback` for event handlers passed to the marker.

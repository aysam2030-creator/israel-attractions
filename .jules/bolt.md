## 2024-10-09 - react-leaflet Map Optimization
**Learning:** Passing inline objects or functions to the `eventHandlers` prop inside loops creates new object references on every render, leading to unnecessary DOM updates.
**Action:** Extract the Leaflet element (like `<Marker>`) into its own memoized component. Also, cache dynamically generated objects like `L.divIcon` instances using an external `Map` based on a composite key of their parameters.

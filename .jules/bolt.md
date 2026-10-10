## 2024-10-10 - Optimizing react-leaflet Marker Rendering
**Learning:** Passing inline objects to eventHandlers in react-leaflet components creates new object references on every render, leading to unnecessary DOM updates. Recreating L.divIcon instances in loops further degrades performance.
**Action:** Extract Leaflet elements into memoized components, pass stable function references or evaluated primitive values, and cache dynamic objects like L.divIcon instances using an external Map.

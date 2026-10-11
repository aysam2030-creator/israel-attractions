## 2023-10-11 - Caching Leaflet Icons
**Learning:** Leaflet's `L.divIcon` creation within a React component's render loop (especially for mapping over numerous markers like attractions) is a significant performance bottleneck. React-Leaflet will re-render all `<Marker>`s and recreate the DOM nodes if the icon instances keep changing on every render.
**Action:** Implement an external cache (e.g., a `Map`) using a composite key based on the parameters (color, isTrip, step) to reuse `L.divIcon` instances across renders and avoid DOM thrashing.

## 2024-10-08 - Leaflet Icon DOM Thrashing
**Learning:** In react-leaflet, passing inline objects to the `icon` prop (e.g. recreating `L.divIcon` inside a map loop on every render) creates new object references on every render, leading to severe, unnecessary DOM thrashing and map updates.
**Action:** Always cache dynamically generated Leaflet elements like `L.divIcon` instances using an external `Map` based on a composite key of their parameters. Additionally, memoize map elements that depend on iterations.

## 2025-01-21 - React-Leaflet Map Render Optimizations
**Learning:** React-Leaflet heavily penalizes dynamically generated props (like `L.divIcon()` and inline event handler objects) inside rendering loops (like `<Marker>`), as it considers them new references and triggers expensive native DOM updates.
**Action:** Always cache Leaflet primitive objects (like icons) using a stringified key Map, and extract loop elements into `React.memo` components, passing state setters directly to avoid inline closure references.

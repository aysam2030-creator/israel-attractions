## 2023-11-20 - Map Marker Memoization
**Learning:** In react-leaflet, passing inline objects or functions to the `eventHandlers` prop (e.g., `eventHandlers={{ click: handler }}`) inside loops creates new object references on every render, leading to unnecessary DOM updates. To optimize this, extract the Leaflet element (like `<Marker>`) into its own memoized component.
**Action:** Always extract Leaflet elements inside loops into memoized components and cache dynamically generated icons with an external Map to prevent DOM thrashing.

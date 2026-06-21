## 2024-06-21 - React-Leaflet Props Reference Stability
**Learning:** In `react-leaflet`, passing inline objects (like `pathOptions={{ color: "#a78bfa", weight: 4 }}`) to map components or recreating Leaflet objects (like `L.divIcon()`) on every render can cause severe performance issues because it constantly triggers Leaflet layer updates due to changing object references.
**Action:** Always extract static options objects (like `pathOptions`) to constants outside the component, and memoize or cache dynamically generated Leaflet objects (like `L.divIcon` instances).

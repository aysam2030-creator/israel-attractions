## 2024-05-24 - React-Leaflet Prop Stability
**Learning:** Passing inline objects (like `pathOptions`) or generating new Leaflet objects on the fly (like `L.divIcon`) during a React render causes react-leaflet to aggressively tear down and recreate DOM elements on the map, leading to severe performance bottlenecks during state updates.
**Action:** Always extract static Leaflet configuration objects to module-level constants and implement caching (like a `Map`) for dynamically generated icons to preserve reference stability across renders.

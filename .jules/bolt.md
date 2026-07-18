## 2024-11-20 - Prevent DOM thrashing in react-leaflet
**Learning:** React-Leaflet heavily depends on stable prop references for its options (like `pathOptions`) and properties (like `icon`). Passing inline objects or dynamically generated objects (like `L.divIcon`) directly in render loops causes severe performance bottlenecks from DOM thrashing because Leaflet interprets them as new props on every render.
**Action:** Use an external cache (e.g. `Map`) for dynamically generated Leaflet properties based on arguments, and extract static configuration objects outside the component body.

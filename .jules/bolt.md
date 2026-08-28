## 2024-05-15 - React-Leaflet object ref caching
**Learning:** Leaflet objects (like `L.divIcon` for react-leaflet markers) that depend on variable arguments inside render loops will create new object references on every render, leading to severe performance bottlenecks from DOM thrashing.
**Action:** Use an external Map to cache these elements based on stringified keys instead of inline component instantiation.

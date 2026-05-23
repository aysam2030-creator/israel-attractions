## 2024-05-23 - React-Leaflet object references
**Learning:** In react-leaflet, passing inline objects like eventHandlers, pathOptions, or recreating L.divIcon instances on every render causes severe DOM thrashing and performance bottlenecks.
**Action:** Always memoize or cache Leaflet properties, such as icon instances, polyline options, and coordinate arrays, to maintain stable object references across renders.

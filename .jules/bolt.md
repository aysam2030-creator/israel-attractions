## 2024-08-05 - Caching React-Leaflet L.divIcon instances
**Learning:** React-Leaflet requires stable object references for props like `icon` or `pathOptions`. If new instances of `L.divIcon` are generated dynamically inside the render loop for multiple markers, it causes severe DOM thrashing because Leaflet tears down and recreates the marker icons on the map on every render.
**Action:** Use an external Map to cache dynamically generated Leaflet objects (like icons) based on their stringified parameters to maintain stable references across renders without violating React hook rules.

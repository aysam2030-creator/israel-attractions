## 2024-05-22 - Optimize Map Marker and Polyline Memory Allocation
**Learning:** In a map rendering component using React-Leaflet, recreating objects directly inside the render loop for `icon` (L.divIcon) and `pathOptions` causes extreme memory bloat and garbage collection pauses because map marker updates can happen frequently on panning/zooming/rendering lists.
**Action:** Always memoize stable objects passed to Leaflet components (e.g. `icon`, `pathOptions`, `positions`) in React.

## 2024-10-31 - [Map Icon Rendering Optimization]
**Learning:** React-Leaflet recreates L.divIcon instances inside loops for map markers on every component render, causing significant DOM thrashing and performance degradation, particularly with complex HTML elements.
**Action:** Extract dynamic icon generation to a cached external `Map` based on a composite key to prevent unnecessary recreation of DOM elements during re-renders.

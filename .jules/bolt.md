## 2024-08-23 - Prevent DOM thrashing by caching Leaflet Pins
**Learning:** `makePin` creates a new Leaflet `L.divIcon` instance every time it is called. Since it is called inside the render loop for `mapAttractions.map`, it causes react-leaflet to re-render all markers in the DOM constantly, degrading performance, particularly when panning or filtering.
**Action:** Use an external caching map (`Map<string, L.DivIcon>`) to memoize and reuse Leaflet marker instances by generating a composite key.

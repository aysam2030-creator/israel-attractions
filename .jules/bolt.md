## 2026-09-14 - [Memoize react-leaflet components]
**Learning:** In `react-leaflet`, passing inline functions (like `() => setSelected(a)`) or generating new icons on every render (like `makePin` without cache) causes the underlying Leaflet DOM elements to be recreated continuously, leading to bad performance and DOM thrashing.
**Action:** Always extract Leaflet elements (like `<Marker>`) into their own memoized components when mapping over data arrays, and cache dynamic objects like `L.divIcon` using an external `Map`.

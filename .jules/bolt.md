## 2024-05-18 - [react-leaflet DOM thrashing]
**Learning:** In `react-leaflet`, recreating `L.divIcon` instances on every render causes massive DOM thrashing and performance degradation when rendering many markers, because leaflet detects it as a new icon.
**Action:** Always cache dynamically generated objects like `L.divIcon` instances using an external `Map` based on a composite key of their parameters, rather than recreating them on every component render inside a loop.

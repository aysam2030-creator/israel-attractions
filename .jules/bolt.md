## 2024-10-16 - Prevent React-Leaflet DOM Thrashing
**Learning:** Recreating `L.divIcon` instances on every render inside `mapAttractions.map()` causes React-Leaflet to constantly update DOM nodes, leading to severe performance degradation when panning/zooming.
**Action:** Cache `L.divIcon` instances outside the render loop using a `Map` based on a composite key of their parameters.

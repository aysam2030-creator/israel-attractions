## 2024-10-20 - [Cache Leaflet DivIcons]
**Learning:** React-Leaflet causes severe DOM thrashing and performance degradation if `L.divIcon` instances are dynamically recreated on every render inside a list loop.
**Action:** Cache dynamically generated objects like `L.divIcon` instances using an external `Map` based on a composite key of their parameters.

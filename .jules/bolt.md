## 2024-11-20 - Memoizing Map Markers with Leaflet
**Learning:** React-Leaflet markers inside large lists re-create `L.divIcon` objects on every render when using inline functions. This causes severe garbage collection and DOM thrashing.
**Action:** Extract map markers into their own `React.memo` component and use an external `Map` to cache `L.divIcon` instances based on a stringified key of their dynamic properties.

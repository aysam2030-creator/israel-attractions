## 2024-06-01 - Leaflet `L.divIcon` caching
**Learning:** React-leaflet marker re-renders cause severe DOM thrashing if the icon reference changes.
**Action:** When working with Leaflet properties like `L.divIcon`, ensure they are cached or memoized to maintain stable object references.

## 2024-05-25 - React-Leaflet object references caching
**Learning:** In a codebase using React-Leaflet, failing to memoize `L.divIcon`, path coordinates (like `tripPath`), or options objects (like `pathOptions`) leads to severe performance bottlenecks from DOM thrashing. Leaflet creates new internal DOM elements whenever references change.
**Action:** Always cache or memoize Leaflet properties to maintain stable object references across renders and prevent DOM thrashing when using React-Leaflet.

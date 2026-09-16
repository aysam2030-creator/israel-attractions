## 2024-05-18 - Optimized React-Leaflet Map Markers
**Learning:** In React-Leaflet, mapping over a large dataset to render `<Marker>` components inline can cause severe performance issues because it recreates `L.divIcon` objects and Leaflet DOM elements on every render.
**Action:** Extract inline markers into a `React.memo` component, ensure only primitive values are passed as props (e.g. `isTrip={tripIds.includes(a.id)}` instead of `tripIds={tripIds}`), and cache `L.divIcon` objects using an external `Map` based on a stringified key.

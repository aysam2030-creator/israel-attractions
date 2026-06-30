## 2024-05-14 - Map Performance: Leaflet Objects

**Learning:** Recreating `L.divIcon` objects or inline object literals for React Leaflet components (like `<Polyline pathOptions={{...}}>`) inside render methods causes severe performance bottlenecks due to constant teardown and rebuild of map markers and path properties on every render.
**Action:** When working with react-leaflet, ensure Leaflet properties (like `L.divIcon`, polyline paths, and options objects) are cached or extracted into module-level constants to maintain stable object references across renders and prevent DOM thrashing.

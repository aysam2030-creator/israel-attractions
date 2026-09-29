## 2023-10-25 - React Leaflet Map Marker Performance
**Learning:** Rendering many Leaflet map markers directly with inline object props (e.g. `eventHandlers={{ click: handler }}`) causes serious re-render lag when the parent changes state, because Leaflet object instances are re-created on each cycle.
**Action:** Extract map markers inside lists to memoized components or memoize the objects/callbacks to avoid unnecessary re-creation of Leaflet instances.

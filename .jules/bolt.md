## 2024-05-18 - Stable object references for react-leaflet
**Learning:** React-leaflet components (Marker, Polyline) are highly sensitive to prop changes. Passing inline objects for properties like `icon` (e.g. `L.divIcon`), `eventHandlers`, or `pathOptions` causes severe DOM thrashing because Leaflet tears down and rebuilds layers on reference changes.
**Action:** Always memoize or cache Leaflet properties like `L.divIcon` objects, event handlers, and options objects. Move static options (like `pathOptions` in `Polyline`) outside the component to ensure reference equality across renders.

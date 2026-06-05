## 2025-06-05 - Leaflet Render Thrashing
**Learning:** In a React-Leaflet application, inline polyline pathOptions and icon definitions (like `L.divIcon`) cause severe DOM thrashing on every re-render (e.g. typing in search) because the object reference changes, making Leaflet tear down and rebuild map elements.
**Action:** Always extract Leaflet properties (like pathOptions) to constants or wrap component markers and their properties (position, icon, eventHandlers) in `useMemo` and `React.memo()` to maintain stable references and stop React from tearing down Leaflet DOM elements.

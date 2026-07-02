## 2024-07-02 - Memoize Leaflet Property References
**Learning:** In a React-Leaflet application, inline arrays and objects for Map Marker `icon`, `eventHandlers`, and Polyline `pathOptions` cause severe DOM thrashing on every render because `L.divIcon` objects and object literals lack stable reference equality.
**Action:** Extract inline configuration objects outside the component, cache Leaflet icons (e.g. `L.divIcon`) using a Map, and wrap individual markers in `React.memo()` with stable `useCallback` event handlers to dramatically reduce map re-renders.

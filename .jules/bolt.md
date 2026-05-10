## 2024-05-18 - React-Leaflet Marker Re-renders
**Learning:** In React-Leaflet, passing a new `L.icon` or `L.divIcon` object reference to `<Marker icon={...} />` causes Leaflet to completely destroy and recreate the marker's DOM node. This causes massive layout thrashing and jitter during frequent React re-renders (like typing in a search input).
**Action:** Always memoize or cache Leaflet icon instances outside of the component render cycle so that the reference remains stable across re-renders unless the visual properties actually change.

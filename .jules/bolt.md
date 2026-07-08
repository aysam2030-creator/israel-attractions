## 2024-07-08 - Leaflet React DOM Thrashing
**Learning:** In react-leaflet, passing dynamically created Leaflet objects (like `L.divIcon` from a helper function) or inline options arrays directly to component props causes severe DOM thrashing on every re-render because object references change.
**Action:** Always cache or extract Leaflet prop options (like `divIcon` instances, `pathOptions`, and `center` coordinates) outside of components or memoize them to maintain stable references.

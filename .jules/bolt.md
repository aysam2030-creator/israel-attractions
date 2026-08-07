## 2024-05-18 - Cached Leaflet objects to prevent React re-rendering
**Learning:** In react-leaflet, inline objects passed to components like `<Polyline pathOptions={{...}}>` or dynamically generating `L.divIcon` during render causes severe DOM thrashing and memory allocations, as Leaflet/React sees them as new references every render.
**Action:** Extract static options to constants outside the component and use a Map cache for dynamically generated Leaflet objects (like parameterized icons) to maintain referential stability.

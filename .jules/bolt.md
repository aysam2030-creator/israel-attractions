## 2024-10-28 - React-Leaflet Map Pin Caching
**Learning:** In React-Leaflet, passing a newly instantiated `L.divIcon` to a Marker inside a render loop causes Leaflet to continually destroy and recreate the underlying marker DOM elements on every map re-render. This causes severe DOM thrashing, garbage collection overhead, and degrades frame rates during map interactions.
**Action:** Cache generated `L.divIcon` objects outside the render cycle (e.g. in a module-level `Map`) and reuse them based on a deterministic composite key. Do not inline `L.divIcon()` calls inside JSX or `map` loops.

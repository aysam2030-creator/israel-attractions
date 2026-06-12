## 2026-06-12 - React-Leaflet Props References
**Learning:** In React-Leaflet, passing inline objects (like `pathOptions={{...}}`) or recreating Leaflet instances (like `L.divIcon`) on every render causes severe performance bottlenecks because Leaflet interprets the reference changes as prop updates and re-applies styles/DOM unnecessarily.
**Action:** Always extract static configuration objects passed to React-Leaflet components to module-level constants or memoize them with `useMemo`. Cache Leaflet objects like icons or complex shapes that are created dynamically.

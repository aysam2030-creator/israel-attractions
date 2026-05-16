## 2026-05-16 - Optimize React Leaflet renders
**Learning:** When working with react-leaflet, passing inline objects or dynamically mapped arrays to map properties like `icon` or `pathOptions` causes severe performance degradation due to DOM thrashing, because the references change on every render.
**Action:** Always cache or memoize map options objects, Leaflet divIcons, and coordinate arrays before passing them into react-leaflet components.

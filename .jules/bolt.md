## 2025-03-08 - React-Leaflet L.divIcon Recreation Trashing
**Learning:** In `react-leaflet`, passing an inline or unmemoized `L.divIcon` (e.g. `icon={makePin(...)}`) causes Leaflet to constantly destroy and recreate the marker DOM elements on every React render. This is a severe performance bottleneck for maps with many markers, especially when a parent component updates frequently (like during search typing).
**Action:** Always memoize or cache Leaflet icons (e.g., using a `Map` outside the render cycle or `useMemo`) so that their object references remain stable across renders.

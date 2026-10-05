## 2024-05-14 - React Leaflet Re-renders
**Learning:** `react-leaflet` component `Marker` accepts an inline function `eventHandlers={{ click: () => setSelected(a) }}` inside `.map()` in `src/App.tsx`. This causes a new object reference on every render, triggering unnecessary DOM updates for every marker on the map. Additionally, `makePin(...)` executes L.divIcon repeatedly for every marker instead of caching icons.
**Action:** Memoize `Marker` instances by extracting it to a component and caching `L.divIcon` pins to avoid recreating them and thrashing DOM.

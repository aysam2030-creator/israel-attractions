## 2024-05-18 - Caching Leaflet properties prevents DOM thrashing
**Learning:** React-Leaflet heavily relies on referential equality for object properties (like `icon`, `pathOptions`, and array of positions). Passing new objects inline or creating them inside the render function causes Leaflet to continually teardown and recreate DOM elements on every React render.
**Action:** Always memoize, hoist, or cache Leaflet complex objects (like `L.divIcon`, style options, and coordinate arrays) when passing them to React-Leaflet components to ensure smooth rendering and avoid severe performance penalties.
## 2024-05-18 - Capacitor CLI context requirement
**Learning:** Running `npx cap sync android` inside the `android/` directory fails with "android platform has not been added yet". Capacitor commands expect to be run from the root of the project where `capacitor.config.ts` exists.
**Action:** Always run `cap` commands from the project root.

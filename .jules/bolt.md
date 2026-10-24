## 2024-05-24 - React-Leaflet Icon DOM Thrashing
**Learning:** In react-leaflet, creating a new `L.divIcon` instance on every component render inside a loop causes Leaflet to detect a changed icon reference. This triggers a full recreation of the marker DOM elements (DOM thrashing), severely degrading performance when panning or updating state.
**Action:** Cache dynamically generated `L.divIcon` instances using an external `Map` based on a composite key of their parameters so the object references remain stable across renders.

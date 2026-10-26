## 2024-10-27 - react-leaflet DOM thrashing with dynamic icons
**Learning:** Recreating `L.divIcon` instances on every component render inside a loop causes `react-leaflet` to destroy and recreate the DOM elements for all markers continuously.
**Action:** Cache dynamically generated objects like `L.divIcon` using an external `Map` based on a composite key of their parameters to prevent unnecessary DOM thrashing.
